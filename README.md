
# Vapeur

Projet Node.js/Prisma/Handlebars pour gérer une ludothèque

## Démarrage rapide
- Installer les dépendances : `npm install`
- Créer le fichier `.env` à la racine avec `DATABASE_URL="file:./database.db"`
- Initialiser la base : `npx prisma migrate dev --name init` puis `npx prisma db seed`
- Lancer le serveur : `npm start`
- Ouvrir le site sur `http://localhost:8080`

## Scripts npm
- `npm start` : démarre le serveur Express
- `npm run dev` : (si disponible) lance le serveur en mode watch via nodemon
- `npm run prisma studio` : (optionnel) ouvre Prisma Studio pour naviguer dans les données

## Structure
- `prisma/` : schéma et migrations
- `views/` : templates Handlebars et styles
- `index.js` : point d’entrée Express

## Équipe
- Julien Saugues-Eyraud
- Lucas Bieszczad
- Bertrand Pradier

