const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_GENRES = [
  'Action',
  'Aventure',
  'RPG',
  'Simulation',
  'Sport',
  'MMORPG',
];

async function main() {
  for (const nom of DEFAULT_GENRES) {
    const existing = await prisma.genre.findFirst({ where: { nom } });
    if (!existing) {
      await prisma.genre.create({ data: { nom } });
    }
  }
  console.log('Seed genres terminé.');
}

main()
  .catch((err) => {
    console.error('Erreur de seed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
