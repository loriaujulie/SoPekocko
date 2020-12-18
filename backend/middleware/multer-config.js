const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
    /* Indication du lieu d'enregistrement pour les fichiers */
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  /* Utilisation du nom d'origine */
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

/* exportation de l'élément multer configuré */
module.exports = multer({storage: storage}).single('image');