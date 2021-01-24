const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const Book = require('../models/Books');

//@route     GET api/books
//@desc      Get all books
//@access    Private
router.get('/', async (req, res) => {
    // res.send("Get all books");
    try {
        const books = await Book.find().sort({date: -1});
        res.json(books);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route     POST api/books
//@desc      Add new books
//@access    Private
router.post('/',[
    check('bookTitle', 'Please add a book title').not().isEmpty(),
    check('authorName', 'Please add a author name').not().isEmpty(),
    check('bookCode', 'Please add a book code').not().isEmpty(),
    check('category', 'Please add a category').not().isEmpty(),
    check('quantity', 'Please add quantity').not().isEmpty(),
    // check('bookTitle', 'Please add a book title').not().isEmpty(),
], 
async (req, res) => {
    // res.send("Add book");
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({errors: errors.array()});
    // }
    const {bookTitle, authorName, bookCode, category, quantity} = req.body;
    try {
        const newBook = new Book({
            bookTitle:bookTitle,
            authorName:authorName,
            bookCode:bookCode,
            category:category,
            quantity:quantity
        });

        const book = await newBook.save();
        res.json(book);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route     PUT api/books/:id
//@desc      Update book
//@access    Private
router.put('/:id', (req, res) => {
    res.send("Update book");
});

//@route     DELETE api/books/:id
//@desc      Update book
//@access    Private
router.delete('/:id', (req, res) => {
    res.send("Delete book");
});

module.exports = router;