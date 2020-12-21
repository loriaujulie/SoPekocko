/* Importation du package permettant de vérifier et authentifier les tokens d'authentification */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      console.log(token)
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

      /* R2cupération de l'id utilisateur */
      const userId = decodedToken.userId;
      console.log(userId)
      if (req.body.userId && req.body.userId !== userId) {
        throw "identifiant de l'utilisateur non valable";
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('la requête est invalide !')
      });
    }
};