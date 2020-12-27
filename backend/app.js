/*Importation du framework express */
const express = require("express");

/*Importation de dotenv pour les variables d'environnement*/
require("dotenv").config();

/* installation du package body-parser */
const bodyParser = require('body-parser');

/* importation du package Mongoose pour la liaison avec MongoDB */
const mongoose = require('mongoose');

/* Gestionnaire de routage pour les images */
const path = require('path');

/* Importation de MongoSanitize pour empêcher que des ordres soient donnés à la base MongoDB*/
const mongoSanitize = require('express-mongo-sanitize');

/*importation de la méthode express du package - Permet de créer une application express */
const app = express ();

/* importation du package de sécurité HELMET */
const helmet = require("helmet");

/* Protection de la force brute */ 
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes - indiqué en millisecondes
  max: 100, // limite à 100 requêtes pour chaque IP
  message:"Trop de connexions, merci de retenter plus tard !"
  });

/* importation de la route */
const sauceRoutes = require('./routes/sauces.js');
const userRoutes = require('./routes/users.js');

/* fonction json du body-parser définie comme middleware global  */
app.use(bodyParser.json());

/* gestion des requêtes POST plus étendues (formulaires par ex)*/
app.use(bodyParser.urlencoded({extended: true}));

/* Liaison avec MongoDB */
mongoose.connect(process.env.LIEN_MONGO,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* ajout de headers permettant aux api d'échanger entre elles - permet de passer au-delà de la sécurité des CORS (cross origin resouce sharing) */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/* Gestionnaire indique à Express qu'il faut gérer le dossier images de manière statique */
app.use('/images', express.static(path.join(__dirname, 'images')));

/*importation de la logique de routes */
app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

/* Rate limiter - limite du nombre de connexions */
app.use(limiter); 

/* Sécurité des headers - dont la sécurité contre les failles XSS */
app.use(helmet());

/*Remplace les caractères non admis comme "$" qui peuvent donner des ordres à la base MongoDB par '_' :*/
app.use(mongoSanitize({
  replaceWith: '_'
}))

/*exportation de l'application pour pouvoir y accéder depuis un serveur node */
module.exports = app;