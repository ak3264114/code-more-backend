const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    status: {
        type: String,
        default: "inactive",
        enum: ["active", "inactive"],
    }
})
const Userdb = mongoose.model('userdb', userSchema);

module.exports = Userdb;
