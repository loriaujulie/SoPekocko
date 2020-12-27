/* https://www.npmjs.com/package/password-validator/v/5.1.1 */
const passwordValidator = require('password-validator');
 
// Create a schema
const schema = new passwordValidator();
 
// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 30
.has().uppercase()                              // Must have 1 uppercase letters
.has().lowercase()                              // Must have lowercase letter
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123' , 'p123456789']); // Blacklist these values
 
console.log(schema.validate('joke', { list: true }));

module.exports = schema;