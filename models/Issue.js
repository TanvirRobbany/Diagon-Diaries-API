const mongoose = require('mongoose');

const IssueSchema = mongoose.Schema({
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('issue', IssueSchema);