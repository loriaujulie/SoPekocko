/*Importation du framework express */
const express = require("express");

/* Création d'un routeur grâce au routeur d'express */
const router = express.Router();

/* Constante du modèle Sauce */
const sauceCtrl = require('../controllers/sauces.js');

/* Appel du middleware ci-dessous, qui se stue dans auth.js */
const auth = require('../middleware/auth.js');

/* ajout du middleware multer */
const multer = require('../middleware/multer-config.js');

/* Middleware qui traite les requêtes POST (placée avant les requêtes globales pour être sûr qu'elle soit bien utilisée pour la requête POST - ordre des middleware essentiel */
router.post("", auth, multer, sauceCtrl.createSauce);

/* fonction utilisée, comprenant la route pour obtenir les sauces, par l'application (l'endpoint) */
router.get("", auth, sauceCtrl.getAllSauces);

/* fonction utilisée, comprenant la route pour obtenir une sauce, par l'application (l'endpoint) */
router.get("/:id", auth, sauceCtrl.getOneSauce);

/* fonction utilisée, comprenant la route pour modifier les sauces, par l'application (l'endpoint) */
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

/* fonction utilisée, comprenant la route pour supprimer une sauce, par l'application (l'endpoint) */
router.delete("/:id", auth, sauceCtrl.deleteSauce);

/* fonction utilisée, comprenant la route pour aimer les sauces, par l'application (l'endpoint) */
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;

