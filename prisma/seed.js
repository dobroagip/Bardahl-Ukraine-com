const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Очищаем существующие данные
  await prisma.orderItem.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.cartItem.deleteMany().catch(() => {});
  await prisma.cart.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.address.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // Создаем категории Bardahl
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Моторні масла',
        slug: 'engine-oils'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Трансмісійні масла',
        slug: 'transmission-oils'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Присадки до мастил',
        slug: 'additives'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Паливні присадки',
        slug: 'fuel-additives'
      }
    }),
    prisma.category.create({
        data: {
            name: 'Охолоджуючі рідини',
            slug: 'coolants'
        }
    }
 )
    ]);

  // Создаем продукты Bardahl
  const products = await Promise.all([
    // Моторные масла
    prisma.product.create({
      data: {
        name: 'Bardahl Synthetic 5W-30',
        description: 'Повносинтетична моторна олива для сучасних двигунів',
        price: 34.99,
        stock: 50,
        images: ['synthetic-oil.jpg'],
        categoryId: categories[0].id
      }
    }),
    prisma.product.create({
      data: {
        name: 'Bardahl High Mileage 10W-40',
        description: 'Спеціальна формула для авто з великим пробігом',
        price: 29.99,
        stock: 35,
        images: ['high-mileage-oil.jpg'],
        categoryId: categories[0].id
      }
    }),
    
    // Охлаждающие жидкости
    prisma.product.create({
      data: {
        name: 'Bardahl Universal Coolant',
        description: 'Універсальна охолоджуюча рідина',
        price: 18.99,
        stock: 80,
        images: ['universal-coolant.jpg'],
        categoryId: categories[1].id
      }
    }),
    
    // Присадки
    prisma.product.create({
      data: {
        name: 'Bardahl Fuel System Cleaner',
        description: 'Очищувач паливної системи',
        price: 14.99,
        stock: 120,
        images: ['fuel-cleaner.jpg'],
        categoryId: categories[2].id
      }
    })
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`📦 Created ${categories.length} categories`);
  console.log(`🛍️  Created ${products.length} products`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });