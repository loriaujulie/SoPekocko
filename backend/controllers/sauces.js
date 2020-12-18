/* importation du modèle Sauce */
const Sauce = require('../models/Sauce.js');

/*Importation de File System de Node pour modifier voire supprimer les fichiers*/
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    /* mongoDB génère automatiquement l'id, il faut donc l'ôter du résultat */
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      /* copie le corps de la requête */
      ...sauceObject,
      /* url de l'image et non seulement son nom $(req.file.filename) */
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    /* conserve les données et crée une promise */
    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

/* fonction utilisée, comprenant la route pour obtenir les sauces, par l'application (l'endpoint) */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

  
/* fonction utilisée, comprenant la route pour obtenir une sauce, par l'application (l'endpoint) */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/* fonction utilisée, comprenant la route pour modifier les sauces, par l'application (l'endpoint) */
exports.modifySauce = (req, res, next) => {
    /* Si objet trouvé, on récupère la chaîne de caractères que l'on transforme en objet et on modifie l'image */
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        /* url de l'image et non seulement son nom $(req.file.  filename) */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : 
    /* Sinon on prend le corps de la requête*/
    { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

/* fonction utilisée, comprenant la route pour supprimer une sauce, par l'application (l'endpoint) */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      /* Fonction permettant de supprimer avec la réponse à afficher une fois le fichier */
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
      });
    })    
    .catch(error => res.status(500).json({ error }));
};

/* fonction utilisée, comprenant la route pour aimer une sauce, par l'application (l'endpoint) */
exports.likeSauce = (req, res, next) => {
    const likedislike = req.body.like;
    const utilisateur = req.body.utilisateur;
    const thisSauceId = req.params.id;
    Sauce.findOne({ _id: req.params.id }).then(sauce => {  
      if (likedislike === 1) {
        Sauce.updateOne(
          { _id: thisSauceId },
          {$push: { usersLiked: utilisateur }, $inc: { likes: +1 },}
        )
        .then(() => res.status(200).json({ message: 'like' }))
        .catch((error) => res.status(400).json({ error }))  
      };
      if (likedislike === -1) {
        Sauce.updateOne(
          { _id: thisSauceId },
          {$push: { usersDisliked: utilisateur }, $inc: { dislikes: +1 },}
        )
        .then(() => res.status(200).json({ message: 'dislike' }))
        .catch((error) => res.status(400).json({ error }))
      };
        if (likedislike === 0) {
        const ind = sauce.usersLiked.indexOf(utilisateur);
        if (ind > -1) {
          sauce.usersLiked.slice(ind, 1);
          Sauce.updateOne(
            { _id: thisSauceId },
            {$push: { usersLiked: {$each: [ ], $slice: ind} }, $inc: { likes: -1 },}
  
          )
          .then(() => res.status(200).json({ message: ' ' }))
          .catch((error) => res.status(400).json({ error }))
        } else if (ind === -1) {
          const indDisliked = sauce.usersDisliked.indexOf(utilisateur);
          sauce.usersDisliked.slice(indDisliked, 1);
          Sauce.updateOne(
            { _id: thisSauceId },
            {$push: { usersDisliked: {$each: [ ], $slice: indDisliked} }, $inc: { dislikes: -1 },}
  
          )
          .then(() => res.status(200).json({ message: ' ' }))
          .catch((error) => res.status(400).json({ error }))
        }
      }
    });
};
