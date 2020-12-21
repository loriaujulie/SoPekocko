/* importation du modèle Sauce */
const Sauce = require('../models/Sauce.js');

/*Importation de File System de Node pour modifier voire supprimer les fichiers*/
const fs = require('fs');

exports.createSauce = (req, res, next) => {    
    const sauceObject = JSON.parse(req.body.sauce);
    /* mongoDB génère automatiquement l'id, il faut donc l'ôter du résultat */
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
  //Récupération de l'état du like/dislike
  const likedislike = JSON.parse(req.body.like);
  //Récupération de l'identifiant de l'utilisateur
  const user = req.body.userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //évaluation de l'attendu relatif à l'état du like et instructions selon le résultat obtenu
      switch (likedislike) {
        case 1:
          //1er cas : première intervention de l'utilisateur, ajout du like
          Sauce.updateOne(
            { _id: req.params.id },
            //$inc incrémente un champ d'une valeur / $push : ajout d'une valeur dans un tableau
            { $inc: { likes: +1 }, $push: { usersLiked: user }},
            )
            .then(() => res.status(200).json({ message: "Vous aimez cette sauce !" }))
            .catch(error => res.status(400).json({ error }));
        break;
        case 0:
          //2ème cas : l'utilisateur a déjà effectué une action et il a aimé, on enlève son j'aime
          if (sauce.usersLiked.find(user => user === req.body.userId)){
            Sauce.updateOne(
              { _id: req.params.id },
              //$inc incrémente un champ d'une valeur / $push : ajout d'une valeur dans un tableau
              { $inc: { likes: -1 }, $push: { usersLiked: user }},
            )
            .then(() => res.status(200).json({ message: "Vous n'aimez plus cette sauce !" }))
            .catch(error => res.status(400).json({ error }));
          } 
          //3ème cas : l'utilisateur a déjà effectué une action et il a disliké, on enlève son j'aime pas
          else if (sauce.usersDisliked.find(user => user === req.body.userId)){
            Sauce.updateOne(
              { _id: req.params.id },
              //$inc incrémente un champ d'une valeur / $push : ajout d'une valeur dans un tableau
              { $inc: { dislikes: -1 }, $push: { usersDisliked: user }},
            )
            .then(() => res.status(200).json({ message: "Finalement, elle n'est pas mal cette sauce !" }))
            .catch(error => res.status(400).json({ error }));
          };
        break;           
        case -1:
          //4ème cas : première intervention de l'utilisateur, ajout du dislike
          Sauce.updateOne(
            { _id: req.params.id },
            //$inc décrémente un champ d'une valeur / $push : ajout d'une valeur dans un tableau
            { $inc: { dislikes: +1 }, $push: { usersDisliked: user }},
            )
            .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce!" }))
            .catch(error => res.status(400).json({ error }));
          break;
    }})
    .catch(error => res.status(500).json({ error }))
};
      