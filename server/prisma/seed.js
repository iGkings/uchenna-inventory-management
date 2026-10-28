import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding iGkings Innovation Inventory database...');

  // 1. Seed Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Demo@12345', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@igkings.com' },
    update: {
      passwordHash,
      name: 'Uchenna',
      role: 'ADMIN',
    },
    create: {
      email: 'demo@igkings.com',
      passwordHash,
      name: 'Uchenna',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
  });

  console.log(`Demo user verified: ${demoUser.email} (${demoUser.name})`);

  // 2. Seed Categories
  const categoriesData = [
    {
      name: 'Smart Wearables',
      slug: 'smart-wearables',
      description: 'Connected smartwatches, fitness trackers, and sensor bands',
    },
    {
      name: 'Audio & Sound',
      slug: 'audio-sound',
      description: 'Studio monitors, wireless headphones, and noise-cancelling earbuds',
    },
    {
      name: 'Office & Workspace',
      slug: 'office-workspace',
      description: 'Ergonomic shelving, desk organization, and display setups',
    },
    {
      name: 'Apparel & Gear',
      slug: 'apparel-gear',
      description: 'Official company uniforms, embroidered shirts, and tech apparel',
    },
    {
      name: 'Tech Accessories',
      slug: 'tech-accessories',
      description: 'High-speed cables, USB docks, magnetic chargers, and miniatures',
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description, slug: cat.slug },
      create: cat,
    });
    categoryMap[cat.name] = created.id;
  }
  console.log(`Categories seeded: ${Object.keys(categoryMap).length}`);

  // 3. Seed Products (matching reference screenshot and realistic SaaS inventory)
  const productsData = [
    {
      name: 'Full Shirt',
      sku: 'APP-001',
      description: 'Premium cotton corporate polo shirt with embroidered iGkings emblem',
      unitPrice: 45.0,
      quantity: 120,
      reorderLevel: 25,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Apparel & Gear',
    },
    {
      name: 'Minimal Watch',
      sku: 'SWR-002',
      description: 'Sleek brushed-metal smart quartz timepiece with leather strap',
      unitPrice: 185.0,
      quantity: 48,
      reorderLevel: 15,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Smart Wearables',
    },
    {
      name: 'Book Shelf',
      sku: 'OFC-003',
      description: 'Modular Scandinavian oak workspace shelf with steel bracing',
      unitPrice: 320.0,
      quantity: 18,
      reorderLevel: 10,
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Office & Workspace',
    },
    {
      name: 'Miniature',
      sku: 'ACC-004',
      description: 'Precision brass desktop sculpture and cable alignment anchor',
      unitPrice: 28.0,
      quantity: 6,
      reorderLevel: 15, // Low stock: 6 <= 15
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Tech Accessories',
    },
    {
      name: 'US Elements',
      sku: 'ACC-005',
      description: 'Rugged ballistic nylon tech travel pouch with modular inserts',
      unitPrice: 65.0,
      quantity: 85,
      reorderLevel: 20,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Tech Accessories',
    },
    {
      name: 'Studio Wireless Earbuds',
      sku: 'AUD-006',
      description: 'Active noise cancellation earbuds with spatial audio and Qi charging case',
      unitPrice: 129.99,
      quantity: 0, // Out of stock: 0
      reorderLevel: 10,
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Audio & Sound',
    },
    {
      name: 'Pro ANC Headphones',
      sku: 'AUD-007',
      description: 'Over-ear studio monitoring headphones with 40-hour battery life',
      unitPrice: 249.0,
      quantity: 34,
      reorderLevel: 12,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Audio & Sound',
    },
    {
      name: 'Ergonomic Desk Monitor 27"',
      sku: 'OFC-008',
      description: 'IPS 4K UHD color-calibrated display with integrated USB-C 90W charging',
      unitPrice: 420.0,
      quantity: 8,
      reorderLevel: 10, // Low stock: 8 <= 10
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Office & Workspace',
    },
    {
      name: 'Fast Wireless Charging Pad',
      sku: 'ACC-009',
      description: '15W MagSafe compatible fast charger with braided Kevlar cord',
      unitPrice: 39.5,
      quantity: 0, // Out of stock: 0
      reorderLevel: 20,
      imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Tech Accessories',
    },
    {
      name: 'Smart Fitness Tracker Band',
      sku: 'SWR-010',
      description: 'Continuous biometric heart rate, SpO2, and sleep tracking sensor',
      unitPrice: 79.99,
      quantity: 62,
      reorderLevel: 15,
      imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Smart Wearables',
    },
    {
      name: 'Mechanical RGB Keyboard',
      sku: 'ACC-011',
      description: 'Hot-swappable tactile switches with aircraft-grade aluminum chassis',
      unitPrice: 139.0,
      quantity: 42,
      reorderLevel: 12,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80',
      categoryName: 'Tech Accessories',
    },
  ];

  const productMap = {};
  for (const item of productsData) {
    const categoryId = categoryMap[item.categoryName];
    const created = await prisma.product.upsert({
      where: { sku: item.sku },
      update: {
        name: item.name,
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        imageUrl: item.imageUrl,
        categoryId,
      },
      create: {
        name: item.name,
        sku: item.sku,
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        imageUrl: item.imageUrl,
        categoryId,
      },
    });
    productMap[item.sku] = created;
  }
  console.log(`Products seeded: ${Object.keys(productMap).length}`);

  // 4. Seed Inventory Movements (Populating recent activity table and monthly chart)
  await prisma.inventoryMovement.deleteMany({}); // clear previous for fresh realistic metrics

  const now = new Date();
  const movements = [
    // October movements (matching recent screenshot)
    {
      sku: 'APP-001',
      type: 'IN',
      quantity: 20,
      previousQuantity: 100,
      newQuantity: 120,
      reason: 'Purchase Restock',
      referenceNote: 'PO #8491 from Apex Textiles',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      sku: 'SWR-002',
      type: 'OUT',
      quantity: 15,
      previousQuantity: 63,
      newQuantity: 48,
      reason: 'Sales Order',
      referenceNote: 'B2B Batch Dispatch #209',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    {
      sku: 'OFC-003',
      type: 'IN',
      quantity: 35,
      previousQuantity: 0,
      newQuantity: 35,
      reason: 'Supplier Delivery',
      referenceNote: 'Container Delivery Zone B',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 28), // yesterday
    },
    {
      sku: 'ACC-004',
      type: 'OUT',
      quantity: 8,
      previousQuantity: 14,
      newQuantity: 6,
      reason: 'Sales Order',
      referenceNote: 'Express Client Fulfillment',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 32),
    },
    {
      sku: 'ACC-005',
      type: 'IN',
      quantity: 50,
      previousQuantity: 35,
      newQuantity: 85,
      reason: 'Warehouse Transfer',
      referenceNote: 'Transferred from North Warehouse',
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
    },
    // Historical movements for Jan - Jun chart
    {
      sku: 'APP-001',
      type: 'IN',
      quantity: 350,
      previousQuantity: 50,
      newQuantity: 400,
      reason: 'Initial Bulk Intake',
      referenceNote: 'Q1 Initial Inventory',
      createdAt: new Date(2026, 0, 15), // Jan
    },
    {
      sku: 'SWR-002',
      type: 'OUT',
      quantity: 180,
      previousQuantity: 400,
      newQuantity: 220,
      reason: 'Seasonal Campaign',
      referenceNote: 'New Year Promotion',
      createdAt: new Date(2026, 0, 22),
    },
    {
      sku: 'AUD-007',
      type: 'IN',
      quantity: 920,
      previousQuantity: 80,
      newQuantity: 1000,
      reason: 'Bulk Production Batch',
      referenceNote: 'Factory shipment #441',
      createdAt: new Date(2026, 1, 12), // Feb (peaks to ~1k+ matching screenshot!)
    },
    {
      sku: 'ACC-005',
      type: 'OUT',
      quantity: 480,
      previousQuantity: 600,
      newQuantity: 120,
      reason: 'Distributor Wholesale',
      referenceNote: 'Major Retailer Consignment',
      createdAt: new Date(2026, 1, 20),
    },
    {
      sku: 'OFC-003',
      type: 'IN',
      quantity: 580,
      previousQuantity: 20,
      newQuantity: 600,
      reason: 'Warehouse Restock',
      referenceNote: 'Office Furniture intake',
      createdAt: new Date(2026, 2, 10), // Mar
    },
    {
      sku: 'APP-001',
      type: 'OUT',
      quantity: 310,
      previousQuantity: 600,
      newQuantity: 290,
      reason: 'Q1 Corporate Orders',
      referenceNote: 'Corporate Client Batch',
      createdAt: new Date(2026, 2, 28),
    },
    {
      sku: 'ACC-011',
      type: 'IN',
      quantity: 620,
      previousQuantity: 15,
      newQuantity: 635,
      reason: 'Tech Launch Inflow',
      referenceNote: 'Product line introduction',
      createdAt: new Date(2026, 3, 14), // Apr
    },
    {
      sku: 'SWR-010',
      type: 'OUT',
      quantity: 410,
      previousQuantity: 635,
      newQuantity: 225,
      reason: 'Spring Campaign Outflow',
      referenceNote: 'Online sales fulfillment',
      createdAt: new Date(2026, 3, 26),
    },
    {
      sku: 'AUD-006',
      type: 'IN',
      quantity: 430,
      previousQuantity: 10,
      newQuantity: 440,
      reason: 'Supply Intake',
      referenceNote: 'Component assembly inbound',
      createdAt: new Date(2026, 4, 18), // May
    },
    {
      sku: 'ACC-004',
      type: 'OUT',
      quantity: 260,
      previousQuantity: 440,
      newQuantity: 180,
      reason: 'Partner Orders',
      referenceNote: 'Partner Distribution',
      createdAt: new Date(2026, 4, 30),
    },
    {
      sku: 'SWR-002',
      type: 'IN',
      quantity: 510,
      previousQuantity: 50,
      newQuantity: 560,
      reason: 'Summer Restock',
      referenceNote: 'Mid-year stock intake',
      createdAt: new Date(2026, 5, 15), // Jun
    },
    {
      sku: 'APP-001',
      type: 'OUT',
      quantity: 380,
      previousQuantity: 560,
      newQuantity: 180,
      reason: 'Summer Festival Orders',
      referenceNote: 'Wholesale event orders',
      createdAt: new Date(2026, 5, 27),
    },
  ];

  for (const mov of movements) {
    const prod = productMap[mov.sku];
    if (prod) {
      await prisma.inventoryMovement.create({
        data: {
          productId: prod.id,
          type: mov.type,
          quantity: mov.quantity,
          previousQuantity: mov.previousQuantity,
          newQuantity: mov.newQuantity,
          reason: mov.reason,
          referenceNote: mov.referenceNote,
          userId: demoUser.id,
          createdAt: mov.createdAt,
        },
      });
    }
  }
  console.log(`Inventory movements seeded: ${movements.length}`);

  // 5. Seed Audit Logs
  await prisma.auditLog.deleteMany({});
  await prisma.auditLog.createMany({
    data: [
      {
        userId: demoUser.id,
        action: 'SYSTEM_INITIALIZATION',
        entity: 'System',
        entityId: 'init-001',
        details: 'Initial database seeding and setup completed for iGkings Innovation',
        ipAddress: '127.0.0.1',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 72),
      },
      {
        userId: demoUser.id,
        action: 'LOGIN',
        entity: 'Auth',
        entityId: demoUser.id,
        details: 'Admin user Uchenna signed in successfully',
        ipAddress: '127.0.0.1',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
      },
      {
        userId: demoUser.id,
        action: 'ADJUST_STOCK',
        entity: 'Product',
        entityId: productMap['APP-001']?.id || 'sample',
        details: 'Added +20 units to Full Shirt (Purchase Restock)',
        ipAddress: '127.0.0.1',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
      },
    ],
  });
  console.log('Audit logs seeded.');

  console.log('\nSeeding successfully finished!');
  console.log('Login credentials:');
  console.log('Email: demo@igkings.com');
  console.log('Password: Demo@12345');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
