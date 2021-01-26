const mongoose = require('mongoose');

const IssueSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('issue', IssueSchema);