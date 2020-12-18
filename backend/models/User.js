const mongoose = require('mongoose');

/* Package de validation pour prévalider les informations avant de les enregistrer et éviter les conflits qui pourraient naître */
const uniqueValidator = require('mongoose-unique-validator');

/* Création d'un schéma de données pour les utilisateurs */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

/* application du validateur au schéma */
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);