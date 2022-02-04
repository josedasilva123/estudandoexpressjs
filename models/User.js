const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    password: String,
    email: String,
}, "usuarios");

module.exports = User
