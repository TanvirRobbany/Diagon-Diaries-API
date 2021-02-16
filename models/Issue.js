const mongoose = require('mongoose');

const IssueSchema = mongoose.Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isReceived: {
        type: Boolean,
        default: false
    },
    receivedDate: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('issue', IssueSchema);