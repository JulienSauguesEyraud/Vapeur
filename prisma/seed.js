// Script de seed: insère des genres et éditeurs par défaut si absents
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Genres créés par défaut
const DEFAULT_GENRES = [
  'Action',
  'Aventure',
  'RPG',
  'Simulation',
  'Sport',
  'MMORPG',
];

// Éditeurs créés par défaut
const DEFAULT_EDITEURS = [
  'Electronic Arts',
  'Ubisoft',
  'Activision Blizzard',
  'Nintendo',
  'Sony Interactive Entertainment',
  'Microsoft Studios',
];

// Jeux créés par défaut (reliés aux genres et éditeurs)
const DEFAULT_JEUX = [
  {
    titre: 'The Legend of Zelda: Breath of the Wild',
    description: 'Un jeu d\'aventure en monde ouvert où vous explorez un vaste royaume rempli de secrets et de défis.',
    genreNom: 'Aventure',
    editeurNom: 'Nintendo',
    dateSortie: new Date('2017-03-03'),
    MisEnAvant: true,
  },
  {
    titre: 'Cyberpunk 2077',
    description: 'Un RPG futuriste situé dans la mégalopole de Night City. Incarnez V et naviguez dans ce monde dystopique.',
    genreNom: 'RPG',
    editeurNom: 'CD Projekt Red',
    dateSortie: new Date('2020-12-10'),
    MisEnAvant: true,
  },
  {
    titre: 'Assassin\'s Creed Valhalla',
    description: 'Incarnez un guerrier Viking et explorez l\'Angleterre médiévale dans ce jeu d\'action et d\'aventure.',
    genreNom: 'Action',
    editeurNom: 'Ubisoft',
    dateSortie: new Date('2020-11-10'),
    MisEnAvant: false,
  },
  {
    titre: 'FIFA 24',
    description: 'Le jeu de football ultime avec des équipes réelles, des joueurs authentiques et des modes de jeu variés.',
    genreNom: 'Sport',
    editeurNom: 'Electronic Arts',
    dateSortie: new Date('2023-09-29'),
    MisEnAvant: false,
  },
  {
    titre: 'World of Warcraft',
    description: 'Le MMORPG le plus célèbre du monde. Explorez Azeroth et rejoignez des millions de joueurs.',
    genreNom: 'MMORPG',
    editeurNom: 'Activision Blizzard',
    dateSortie: new Date('2004-11-23'),
    MisEnAvant: true,
  },
  {
    titre: 'Flight Simulator',
    description: 'Une simulation de vol hyper-réaliste qui reproduit le monde entier avec une précision spectaculaire.',
    genreNom: 'Simulation',
    editeurNom: 'Microsoft Studios',
    dateSortie: new Date('2020-08-18'),
    MisEnAvant: false,
  },
  {
    titre: 'Elden Ring',
    description: 'Un RPG d\'action sombre et challenging dans un monde fantastique riche de mystères.',
    genreNom: 'RPG',
    editeurNom: 'Bandai Namco Entertainment',
    dateSortie: new Date('2022-02-25'),
    MisEnAvant: true,
  },
];

// Insère les entrées en évitant les doublons
async function main() {
  // Créer les genres
  for (const nom of DEFAULT_GENRES) {
    const existing = await prisma.genre.findFirst({ where: { nom } });
    if (!existing) {
      await prisma.genre.create({ data: { nom } });
    }
  }

  // Créer les éditeurs
  for (const nom of DEFAULT_EDITEURS) {
    const existing = await prisma.editeur.findFirst({ where: { nom } });
    if (!existing) {
      await prisma.editeur.create({ data: { nom } });
    }
  }

  // Créer les jeux avec leurs relations
  for (const jeuData of DEFAULT_JEUX) {
    const existingJeu = await prisma.jeu.findFirst({ where: { titre: jeuData.titre } });
    
    if (!existingJeu) {
      // Récupérer le genre
      let genre = await prisma.genre.findFirst({ where: { nom: jeuData.genreNom } });
      if (!genre) {
        genre = await prisma.genre.create({ data: { nom: jeuData.genreNom } });
      }

      // Récupérer l'éditeur
      let editeur = await prisma.editeur.findFirst({ where: { nom: jeuData.editeurNom } });
      if (!editeur) {
        editeur = await prisma.editeur.create({ data: { nom: jeuData.editeurNom } });
      }

      // Créer le jeu
      await prisma.jeu.create({
        data: {
          titre: jeuData.titre,
          description: jeuData.description,
          dateSortie: jeuData.dateSortie,
          MisEnAvant: jeuData.MisEnAvant,
          genreId: genre.id,
          editeurId: editeur.id,
        },
      });
    }
  }

  console.log('Seed genres, éditeurs et jeux terminé.');
}

// Exécution du seed avec gestion d'erreur et fermeture de connexion
main()
  .catch((err) => {
    console.error('Erreur de seed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
