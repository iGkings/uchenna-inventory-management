import { prisma } from '../utils/prisma.js';
import { logAudit } from './auditService.js';

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const listCategories = async ({ search = '' }) => {
  const where = {};
  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search.trim() } },
      { description: { contains: search.trim() } },
    ];
  }

  const categories = await prisma.category.findMany({
    where,
    include: {
      products: {
        select: {
          id: true,
          unitPrice: true,
          quantity: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories.map((cat) => {
    const productCount = cat.products.length;
    const totalInventoryValue = cat.products.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);
    const totalStockQuantity = cat.products.reduce((acc, p) => acc + p.quantity, 0);

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      productCount,
      totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
      totalStockQuantity,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    };
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { name: 'asc' },
      },
    },
  });

  if (!category) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }

  const totalInventoryValue = category.products.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);

  return {
    ...category,
    productCount: category.products.length,
    totalInventoryValue: Number(totalInventoryValue.toFixed(2)),
  };
};

export const createCategory = async (categoryData, userId = null, ipAddress = null) => {
  const { name, description } = categoryData;
  const slug = generateSlug(name);

  // Check unique name
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: { equals: name } }, { slug: { equals: slug } }],
    },
  });

  if (existing) {
    const error = new Error(`A category with the name "${name}" already exists.`);
    error.statusCode = 409;
    throw error;
  }

  const created = await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  await logAudit({
    userId,
    action: 'CREATE_CATEGORY',
    entity: 'Category',
    entityId: created.id,
    details: `Created category "${created.name}"`,
    ipAddress,
  });

  return {
    ...created,
    productCount: 0,
    totalInventoryValue: 0,
  };
};

export const updateCategory = async (id, updateData, userId = null, ipAddress = null) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }

  let slug = existing.slug;
  if (updateData.name && updateData.name !== existing.name) {
    slug = generateSlug(updateData.name);
    const duplicate = await prisma.category.findFirst({
      where: {
        id: { not: id },
        OR: [{ name: { equals: updateData.name } }, { slug: { equals: slug } }],
      },
    });

    if (duplicate) {
      const error = new Error(`A category named "${updateData.name}" already exists.`);
      error.statusCode = 409;
      throw error;
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: updateData.name !== undefined ? updateData.name : existing.name,
      slug,
      description: updateData.description !== undefined ? updateData.description : existing.description,
    },
  });

  await logAudit({
    userId,
    action: 'UPDATE_CATEGORY',
    entity: 'Category',
    entityId: id,
    details: `Updated category "${updated.name}"`,
    ipAddress,
  });

  return updated;
};

export const deleteCategory = async (id, userId = null, ipAddress = null) => {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true, name: true },
      },
    },
  });

  if (!existing) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }

  if (existing.products && existing.products.length > 0) {
    const count = existing.products.length;
    const error = new Error(
      `Cannot delete category "${existing.name}". It currently has ${count} active product(s) assigned. Please reassign or remove these products before deleting this category.`
    );
    error.statusCode = 400;
    throw error;
  }

  await prisma.category.delete({ where: { id } });

  await logAudit({
    userId,
    action: 'DELETE_CATEGORY',
    entity: 'Category',
    entityId: id,
    details: `Deleted category "${existing.name}"`,
    ipAddress,
  });

  return { success: true, deletedName: existing.name };
};
