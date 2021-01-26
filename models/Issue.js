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
    }
});

module.exports = mongoose.model('issue', IssueSchema);