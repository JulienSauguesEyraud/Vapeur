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

const DEFAULT_EDITEURS = [
  'Electronic Arts',
  'Ubisoft',
  'Activision Blizzard',
  'Nintendo',
  'Sony Interactive Entertainment',
  'Microsoft Studios',
];

async function main() {
  for (const nom of DEFAULT_GENRES) {
    const existing = await prisma.genre.findFirst({ where: { nom } });
    if (!existing) {
      await prisma.genre.create({ data: { nom } });
    }
  }

  for (const nom of DEFAULT_EDITEURS) {
    const existing = await prisma.editeur.findFirst({ where: { nom } });
    if (!existing) {
      await prisma.editeur.create({ data: { nom } });
    }
  }

  console.log('Seed genres et éditeurs terminé.');
}

main()
  .catch((err) => {
    console.error('Erreur de seed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
