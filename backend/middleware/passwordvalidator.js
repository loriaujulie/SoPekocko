const passwordValidatorSchema = require('../models/PasswordValidator.js');

module.exports = (req, res, next)=>{
    if( ! passwordValidatorSchema.validate(req.body.password)){
        return res.status(400).json({ error: "Entre 8 - 30 caractères, une minuscule, deux chiffres"});
    }else{
        next();
    }
}