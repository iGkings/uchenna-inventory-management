import { prisma } from '../utils/prisma.js';
import { logAudit } from './auditService.js';

export const computeStockStatus = (quantity, reorderLevel) => {
  if (quantity <= 0) return 'OUT_OF_STOCK';
  if (quantity <= reorderLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
};

export const listProducts = async ({
  search = '',
  categoryId = '',
  status = 'ALL',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  page = 1,
  limit = 10,
}) => {
  const where = {};

  if (search && search.trim()) {
    const term = search.trim();
    where.OR = [
      { name: { contains: term } },
      { sku: { contains: term } },
      { description: { contains: term } },
    ];
  }

  if (categoryId && categoryId !== 'ALL') {
    where.categoryId = categoryId;
  }

  // Handle stock status filtering in SQL/Prisma where possible
  if (status === 'OUT_OF_STOCK') {
    where.quantity = 0;
  }

  // Allowed sort columns
  const validSortFields = ['name', 'sku', 'unitPrice', 'quantity', 'reorderLevel', 'createdAt', 'updatedAt'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
  const take = Math.max(1, parseInt(limit, 10));

  // If status is LOW_STOCK or IN_STOCK, since reorderLevel varies per row, we can fetch matching records
  const [totalCount, rawProducts] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { [sortField]: order },
      skip: status === 'LOW_STOCK' || status === 'IN_STOCK' ? undefined : skip,
      take: status === 'LOW_STOCK' || status === 'IN_STOCK' ? undefined : take,
    }),
  ]);

  let products = rawProducts.map((p) => ({
    ...p,
    status: computeStockStatus(p.quantity, p.reorderLevel),
    inventoryValue: Number((p.quantity * p.unitPrice).toFixed(2)),
  }));

  // In-memory filter if complex status condition
  if (status === 'LOW_STOCK') {
    products = products.filter((p) => p.status === 'LOW_STOCK');
  } else if (status === 'IN_STOCK') {
    products = products.filter((p) => p.status === 'IN_STOCK');
  }

  const finalTotal = status === 'LOW_STOCK' || status === 'IN_STOCK' ? products.length : totalCount;
  const paginatedProducts =
    status === 'LOW_STOCK' || status === 'IN_STOCK'
      ? products.slice(skip, skip + take)
      : products;

  return {
    products: paginatedProducts,
    pagination: {
      total: finalTotal,
      page: parseInt(page, 10),
      limit: take,
      totalPages: Math.ceil(finalTotal / take) || 1,
    },
  };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      movements: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error('Product not found.');
  }

  return {
    ...product,
    status: computeStockStatus(product.quantity, product.reorderLevel),
    inventoryValue: Number((product.quantity * product.unitPrice).toFixed(2)),
  };
};

export const createProduct = async (productData, userId = null, ipAddress = null) => {
  const { name, sku, description, unitPrice, quantity = 0, reorderLevel = 10, categoryId, imageUrl } = productData;

  // Verify SKU uniqueness
  const existingSku = await prisma.product.findUnique({ where: { sku } });
  if (existingSku) {
    const error = new Error(`A product with SKU "${sku}" already exists.`);
    error.statusCode = 409;
    throw error;
  }

  // Verify category exists
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    const error = new Error('Selected category does not exist.');
    error.statusCode = 400;
    throw error;
  }

  const result = await prisma.$transaction(async (tx) => {
    const newProduct = await tx.product.create({
      data: {
        name,
        sku,
        description,
        unitPrice,
        quantity,
        reorderLevel,
        imageUrl: imageUrl || null,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    if (quantity > 0) {
      await tx.inventoryMovement.create({
        data: {
          productId: newProduct.id,
          type: 'IN',
          quantity,
          previousQuantity: 0,
          newQuantity: quantity,
          reason: 'Initial Inventory Intake',
          referenceNote: 'Initial stock entered on product creation',
          userId,
        },
      });
    }

    return newProduct;
  });

  await logAudit({
    userId,
    action: 'CREATE_PRODUCT',
    entity: 'Product',
    entityId: result.id,
    details: `Created product "${result.name}" (SKU: ${result.sku}) with quantity ${result.quantity}`,
    ipAddress,
  });

  return {
    ...result,
    status: computeStockStatus(result.quantity, result.reorderLevel),
    inventoryValue: Number((result.quantity * result.unitPrice).toFixed(2)),
  };
};

export const updateProduct = async (id, updateData, userId = null, ipAddress = null) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  if (updateData.sku && updateData.sku !== existing.sku) {
    const existingSku = await prisma.product.findUnique({ where: { sku: updateData.sku } });
    if (existingSku) {
      const error = new Error(`SKU "${updateData.sku}" is already in use by another product.`);
      error.statusCode = 409;
      throw error;
    }
  }

  if (updateData.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: updateData.categoryId } });
    if (!category) {
      const error = new Error('Selected category does not exist.');
      error.statusCode = 400;
      throw error;
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: updateData.name !== undefined ? updateData.name : existing.name,
      sku: updateData.sku !== undefined ? updateData.sku : existing.sku,
      description: updateData.description !== undefined ? updateData.description : existing.description,
      unitPrice: updateData.unitPrice !== undefined ? updateData.unitPrice : existing.unitPrice,
      reorderLevel: updateData.reorderLevel !== undefined ? updateData.reorderLevel : existing.reorderLevel,
      categoryId: updateData.categoryId !== undefined ? updateData.categoryId : existing.categoryId,
      imageUrl: updateData.imageUrl !== undefined ? updateData.imageUrl : existing.imageUrl,
    },
    include: {
      category: true,
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE_PRODUCT',
    entity: 'Product',
    entityId: id,
    details: `Updated product "${updated.name}"`,
    ipAddress,
  });

  return {
    ...updated,
    status: computeStockStatus(updated.quantity, updated.reorderLevel),
    inventoryValue: Number((updated.quantity * updated.unitPrice).toFixed(2)),
  };
};

export const deleteProduct = async (id, userId = null, ipAddress = null) => {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { movements: true },
  });

  if (!existing) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  await prisma.product.delete({
    where: { id },
  });

  await logAudit({
    userId,
    action: 'DELETE_PRODUCT',
    entity: 'Product',
    entityId: id,
    details: `Deleted product "${existing.name}" (SKU: ${existing.sku})`,
    ipAddress,
  });

  return { success: true, deletedSku: existing.sku, deletedName: existing.name };
};

export const adjustStock = async ({
  productId,
  type,
  quantity,
  reason,
  referenceNote = null,
  userId = null,
  ipAddress = null,
}) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    const previousQuantity = product.quantity;
    let newQuantity = previousQuantity;
    const qtyChange = parseInt(quantity, 10);

    if (type === 'IN') {
      newQuantity = previousQuantity + qtyChange;
    } else if (type === 'OUT') {
      if (previousQuantity < qtyChange) {
        const error = new Error(
          `Insufficient stock. Current quantity is ${previousQuantity}, cannot remove ${qtyChange} units.`
        );
        error.statusCode = 400;
        throw error;
      }
      newQuantity = previousQuantity - qtyChange;
    } else if (type === 'ADJUSTMENT') {
      newQuantity = qtyChange; // direct inventory reconciliation
    } else {
      const error = new Error('Invalid adjustment type.');
      error.statusCode = 400;
      throw error;
    }

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: { quantity: newQuantity },
      include: { category: true },
    });

    const movement = await tx.inventoryMovement.create({
      data: {
        productId,
        type,
        quantity: type === 'ADJUSTMENT' ? Math.abs(newQuantity - previousQuantity) : qtyChange,
        previousQuantity,
        newQuantity,
        reason,
        referenceNote,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: 'ADJUST_STOCK',
        entity: 'Product',
        entityId: productId,
        details: `Stock ${type} of ${qtyChange} units for "${product.name}". Balance: ${previousQuantity} -> ${newQuantity}`,
        ipAddress,
      },
    });

    return {
      product: {
        ...updatedProduct,
        status: computeStockStatus(updatedProduct.quantity, updatedProduct.reorderLevel),
        inventoryValue: Number((updatedProduct.quantity * updatedProduct.unitPrice).toFixed(2)),
      },
      movement,
    };
  });
};

export const exportProductsCsv = async () => {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: 'asc' },
  });

  const headers = ['ID', 'SKU', 'Product Name', 'Category', 'Unit Price ($)', 'Current Stock', 'Reorder Level', 'Stock Status', 'Total Value ($)', 'Last Updated'];
  const rows = products.map((p) => {
    const status = computeStockStatus(p.quantity, p.reorderLevel);
    const value = (p.quantity * p.unitPrice).toFixed(2);
    const date = new Date(p.updatedAt).toISOString().split('T')[0];
    return [
      `"${p.id}"`,
      `"${p.sku}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category ? p.category.name.replace(/"/g, '""') : 'Unassigned'}"`,
      p.unitPrice.toFixed(2),
      p.quantity,
      p.reorderLevel,
      `"${status}"`,
      value,
      `"${date}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
};
