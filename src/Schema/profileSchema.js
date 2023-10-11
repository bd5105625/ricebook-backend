const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        // unique: true,
        required: true
    },
    displayname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // unique: true,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    // following with type list of string
    following: {
        type: [String],
        required: true
    }
})

module.exports = profileSchema


