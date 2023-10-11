const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    pid: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    comments: {
        // type: [{String}],
        type: [mongoose.Schema.Types.Mixed],
        // required: true
    },
    img: {
        type: String,
        // required: true
    }

})

module.exports = articleSchema