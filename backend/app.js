/*Importation du framework express */
const express = require("express");

/* installation du package body-parser */
const bodyParser = require('body-parser');

/* importation du package Mongoose pour la liaison avec MongoDB */
const mongoose = require('mongoose');

/* Gestionnaire de routage pour les images */
const path = require('path');

/* importation de la route */
const sauceRoutes = require('./routes/sauces.js');
const userRoutes = require('./routes/users.js');

/*importation de la méthode express du package - Permet de créer une application express */
const app = express ();

/* ajout de headers permettant aux api d'échanger entre elles - permet de passer au-delà de la sécurité des CORS (cross origin resouce sharing) */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/* fonction json du body-parser définie comme middleware global  */
app.use(bodyParser.json());

/* Liaison avec MongoDB */
mongoose.connect('mongodb+srv://user1:user1@cluster0.dlwlg.mongodb.net/piquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Gestionnaire indique à Express qu'il faut gérer le dossier images de manière statique */
app.use('/images', express.static(path.join(__dirname, 'images')));

/*importation de la logique de routes */
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

/*exportation de l'application pour pouvoir y accéder depuis un serveur node */
module.exports = app;