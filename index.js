const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const prisma = new PrismaClient();
const PORT = 8080;

const hbs = require("hbs");

// Configuration de Handlebars pour Express
app.set("view engine", "hbs"); // On définit le moteur de template que Express va utiliser
app.set("views", path.join(__dirname, "views")); // On définit le dossier des vues (dans lequel se trouvent les fichiers .hbs)
hbs.registerPartials(path.join(__dirname, "views", "partials")); // On définit le dossier des partials (composants e.g. header, footer, menu...)
app.use(express.static(path.join(__dirname, "views"))); // On définit le dossier des fichiers statiques (CSS, JS, images...)

// Page d'accueil
app.get('/', async (req, res) => {
    const jeux = await prisma.jeu.findMany({
        where: {
            MisEnAvant: true
        }
        ,orderBy: {
            titre: 'asc'
        }
    });
    res.render('index', { jeux });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

