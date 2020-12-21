/*Importation du framework express */
const express = require("express");

/* installation du package body-parser */
const bodyParser = require('body-parser');

/* importation du package Mongoose pour la liaison avec MongoDB */
const mongoose = require('mongoose');

/* Gestionnaire de routage pour les images */
const path = require('path');

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

  /* Masquage de l'adresse email */
  const MaskData = require('maskdata');

  const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 0,
    unmaskedEndCharactersAfterAt: 257, // Give a number which is more than the characters after @
    maskAtTheRate: false
};

const email = "sylvain@gmail.com";

const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

/* ajout de headers permettant aux api d'échanger entre elles - permet de passer au-delà de la sécurité des CORS (cross origin resouce sharing) */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/* importation de la route */
const sauceRoutes = require('./routes/sauces.js');
const userRoutes = require('./routes/users.js');

/* fonction json du body-parser définie comme middleware global  */
app.use(bodyParser.json());

/* Liaison avec MongoDB */
mongoose.connect('mongodb+srv://user2:2020-utilisateurP6@cluster0.dlwlg.mongodb.net/piquante?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Gestionnaire indique à Express qu'il faut gérer le dossier images de manière statique */
app.use('/images', express.static(path.join(__dirname, 'images')));

/*importation de la logique de routes */
app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

/* Rate limiter - limite du nombre de connexions */
app.use(limiter); 

/* Sécurité des headers */
app.use(helmet());
app.disable('x-powered-by');

/*GESTION DE L'erreur 404*/
app.get('*', function(req, res){
  res.send('Il y a un problème', 404);
});

/*exportation de l'application pour pouvoir y accéder depuis un serveur node */
module.exports = app;