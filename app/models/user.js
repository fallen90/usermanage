var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

// set up a mongoose schmea
var UserSchema = new Schema({
    username: { type: String, index: { unique: true, dropDups: true } },
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    address: String,
    admin: Boolean,
    last_login: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
