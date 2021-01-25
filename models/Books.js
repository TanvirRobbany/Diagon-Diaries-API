const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    bookTitle: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    bookCode: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('book', BookSchema);