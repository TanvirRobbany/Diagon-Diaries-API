const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/Users');
const Book = require('../models/Books');
const Issue = require('../models/Issue');

//@route     GET api/books
//@desc      Get all books
//@access    Private
router.get('/', auth, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user.id }).sort({ date: -1 });
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route     GET api/books/issue
//@desc      Get all issued books
//@access    Private
router.get('/issue', auth, async (req, res) => {
    try {
        const issued = await Issue.find().populate("bookID").populate("userID").sort({ date: -1 });
        res.json(issued);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route     POST api/books
//@desc      Add new books
//@access    Private
router.post('/', [auth,
    check('bookTitle', 'Please add a book title').not().isEmpty(),
    check('authorName', 'Please add a author name').not().isEmpty(),
    check('bookCode', 'Please add a book code').not().isEmpty(),
    check('category', 'Please add a category').not().isEmpty(),
    check('quantity', 'Please add quantity').not().isEmpty(),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { bookTitle, authorName, bookCode, category, quantity } = req.body;
        try {
            const newBook = new Book({
                bookTitle,
                authorName,
                bookCode,
                category,
                quantity,
                user: req.user.id
            });

            const book = await newBook.save();
            res.json(book);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });

//@route     POST api/books/search
//@desc      Find books
//@access    Public
router.post('/search', 
// [
//     check('bookTitle', 'Please add a book title').not().isEmpty(),
// ],
    async (req, res) => {
        const {query} = req.body;
       
        // console.log(search);

            try {
                const search = await Book.find({ $or: [{bookTitle: { $regex: new RegExp(query) }}, 
                                                {authorName: { $regex: new RegExp(query) }},
                                                {bookCode: { $regex: new RegExp(query) }}]});
                // .find({ authorName: { $regex: new RegExp(query) } })
                // .find({ bookCode: { $regex: new RegExp(query) } })
                // .find({ quantity: { $regex: new RegExp(query) } });
                res.json(search);
                
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
    });

//@route     POST api/books/issue
//@desc      Add new books
//@access    Private
router.post('/issue', [auth,
    check('bookID', 'Please add a book id').not().isEmpty(),
    check('userID', 'Please add a user id').not().isEmpty(),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { bookID, userID } = req.body;
        const bookValidation = await Book.findOne({ bookCode: bookID });
        const userValidation = await User.findOne({ studentID: userID })
        console.log(bookValidation, userValidation)
        if (bookValidation !== null && userValidation.length !== null) {
            try {
                const newBookId = bookValidation._id;
                const newUserId = userValidation._id;

                const newIssue = new Issue({
                    // bookTitle: req.book.bookTitle,
                    bookID: newBookId,
                    userID: newUserId
                });
                // const book = await newBook.save();
                const issue = await newIssue.save();
                res.json(issue);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server error');
            }
        }
        else {
            res.status(400).send("User or Book not available")
        }
    });

//@route     POST api/books/issue/search
//@desc      Find books
//@access    Public
// router.post('/issue/search', 
// // [
// //     check('bookTitle', 'Please add a book title').not().isEmpty(),
// // ],
//     async (req, res) => {
//         const {query} = req.body;
       
//         // console.log(search);

//             try {
//                 const search = await Issue.populate("bookID").populate("userID").find({ $or: [{bookTitle: { $regex: new RegExp(query) }}, 
//                     {studentID: { $regex: new RegExp(query) }},
//                     {bookCode: { $regex: new RegExp(query) }}] });
//                 res.json(search);
                
//             } catch (err) {
//                 console.error(err.message);
//                 res.status(500).send('Server error');
//             }
//     });

//@route     PUT api/books/:id
//@desc      Update book
//@access    Private
router.put('/:id', async (req, res) => {
    const { bookTitle, authorName, bookCode, category, quantity } = req.body;

    const bookFields = {};
    if (bookTitle) bookFields.bookTitle = bookTitle;
    if (authorName) bookFields.authorName = authorName;
    if (bookCode) bookFields.bookCode = bookCode;
    if (category) bookFields.category = category;
    if (quantity) bookFields.quantity = quantity;

    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        book = await Book.findByIdAndUpdate(req.params.id, { $set: bookFields }, { new: true });
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route     DELETE api/books/:id
//@desc      Update book
//@access    Private
router.delete('/:id', async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        await Book.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Book removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route     DELETE api/books/issue/:id
//@desc      Update book
//@access    Private
router.delete('/issue/:id', async (req, res) => {
    try {
        let issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).json({ msg: 'Issue not found' });
        }

        await Issue.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Issue removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;