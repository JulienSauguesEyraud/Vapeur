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
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser le corps des requêtes POST

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

    // GET /jeux - liste tous les jeux
app.get('/jeux', async (req, res) => {
    const jeux = await prisma.jeu.findMany();
    res.render('jeux', { jeux });
});

    // POST /jeux - crée un nouveau jeu
app.post('/jeux', async (req, res) => {
    const jeu = req.body;
    await prisma.jeu.create({
        data: {
            titre: jeu.titre,
            description: jeu.description,
            dateSortie: new Date(jeu.dateSortie),
            genre: { connect: { id: parseInt(jeu.genre) } },
            editeur: { connect: { id: parseInt(jeu.editeur) } },
            MisEnAvant: jeu.MisEnAvant === 'on',
        }
    });
    res.redirect('/jeux');
    // GET /jeux/creation - formulaire de création de jeu
});

app.get('/jeux/creation', async (req, res) => {
    const genres = await prisma.genre.findMany();
    const editeurs = await prisma.editeur.findMany();
    res.render('jeux/creation', { genres, editeurs });
    // GET /jeux/:id - détails d'un jeu
});
            

app.get('/jeux/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const jeu = await prisma.jeu.findUnique({
        where: { id: id },
        include: { 
            genre: true,
            editeur: true
        }
    });
    jeu.dateSortie = jeu.dateSortie.toLocaleDateString('fr-FR');
    // POST /jeux/:id - met à jour un jeu
    res.render('jeux/details', { jeu });
});

app.post('/jeux/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const jeu = req.body;
    await prisma.jeu.update({
        where: { id: id },
        data: {
            titre: jeu.titre,
            description: jeu.description,
            dateSortie: new Date(jeu.dateSortie),
            genre: { connect: { id: parseInt(jeu.genre) } },
            editeur: { connect: { id: parseInt(jeu.editeur) } },
            MisEnAvant: jeu.MisEnAvant === 'on',
        }
    });
    // GET /jeux/modification/:id - formulaire de modification d'un jeu
    res.redirect(`/jeux/${id}`);
});

app.get('/jeux/modification/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let jeu = await prisma.jeu.findUnique({
        where: { id: id }
    });
    jeu.dateSortie = jeu.dateSortie.toISOString().split('T')[0];
    const genres = await prisma.genre.findMany();
    const editeurs = await prisma.editeur.findMany();
    // GET /jeux/suppression/:id - page de confirmation de suppression
    res.render('jeux/modification', { jeu, genres, editeurs });
});

app.get('/jeux/suppression/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const jeu = await prisma.jeu.findUnique({
        where: { id: id }
    });
    // POST /jeux/suppression/:id - supprime un jeu
    res.render('jeux/suppression', { jeu });
});

app.post('/jeux/suppression/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.jeu.delete({
        where: { id: id }
    });
    res.redirect('/jeux');
});

//============================================
//=============    Lucas Code    =============
//============================================

// GET /editeurs - liste tous les éditeurs
app.get('/editeurs', async (req, res) => {
    const editeurs = await prisma.editeur.findMany();
    res.render('editeurs', { editeurs });
});

// POST /editeurs - crée un éditeur
app.post('/editeurs', async (req, res) => {
    const editeur = req.body;
    await prisma.editeur.create({
        data: {
            nom: editeur.nom,
        }
    });
    res.redirect('/editeurs');
});

// GET /editeurs/creation - formulaire de création d'éditeur
app.get('/editeurs/creation', async (req, res) => {
    res.render('editeurs/creation');
});

// GET /editeurs/:id - détails d'un éditeur et ses jeux
app.get('/editeurs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const editeur = await prisma.editeur.findUnique({
        where: { id: id }
    });
    const jeux = await prisma.jeu.findMany({
        where: { editeurId: id }
    });
    res.render('editeurs/details', { editeur, jeux });
});

// POST /editeurs/:id - met à jour un éditeur
app.post('/editeurs/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const editeur = req.body;
    await prisma.editeur.update({
        where: { id: id },
        data: {
            nom: editeur.nom,
        }
    });
    res.redirect(`/editeurs/${id}`);
});

// GET /editeurs/modification/:id - formulaire de modification d'éditeur
app.get('/editeurs/modification/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let editeur = await prisma.editeur.findUnique({
        where: { id: id }
    });
    res.render('editeurs/modification', { editeur});
});

// GET /editeurs/suppression/:id - confirmation de suppression (bloqué si jeux liés)
app.get('/editeurs/suppression/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    //verifier si il y a au moins un jeu lié à cet éditeur
    const jeuxCount = await prisma.jeu.count({
        where: { editeurId: id }
    });
    
    const editeur = await prisma.editeur.findUnique({
        where: { id: id }
    });
    if (jeuxCount > 0) {
        res.render('editeurs/Impossiblesuppression', { editeur });
        return;
    }
    res.render('editeurs/suppression', { editeur });
});

// POST /editeurs/suppression/:id - supprime un éditeur
app.post('/editeurs/suppression/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.editeur.delete({
        where: { id: id }
    });
    res.redirect('/editeurs');
});


// GET /genres - liste des genres avec leurs jeux
app.get('/genres', async (req, res) => {
    const genres = await prisma.genre.findMany({
        include: { jeux: true },
        orderBy: { nom: 'asc' }
    });
    res.render('genres/index', { genres });
});

// GET /genres/:id - détails d'un genre (404 si non trouvé)
app.get('/genres/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const genre = await prisma.genre.findUnique({
        where: { id },
        include: {
            jeux: {
                orderBy: { titre: 'asc' },
                include: { editeur: true }
            }
        }
    });

    if (!genre) {
        return res.status(404).render('errors/404', { message: 'Genre introuvable' });
    }

    res.render('genres/details', { genre });
});

app.use((req, res) => {
    res.status(404).render('errors/404', { message: 'Page introuvable' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).render('errors/500', { message: 'Une erreur interne est survenue' });
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

