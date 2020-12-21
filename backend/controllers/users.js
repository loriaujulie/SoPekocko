/* Création d'un routeur spécifique pour l'authentification */
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/User.js'); 

/* enregistrement de nouveaux utilisateurs */
exports.signup = (req, res, next) => {
    /* hash du mot de passe avant l'enregistrement - fonction asynchrone - 10 correspond au nombre de tours où on execute le hashage */
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
            /* adresse email correspond à celle présente dans la requête */
          email: req.body.email,
          /* enregistrement du mot de passe crypté ci-dessus */
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: "l'utilisateur a été créé !" }))
          .catch(error => res.status(400).json({ error }));
    })
      .catch(error => res.status(500).json({ error }));
};

/* connexion des utilisateurs */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: "l'utilisateur n'a pas été trouvé !" });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'le mot de passe est incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )  
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };