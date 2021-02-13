const express = require('express');
const router = express.Router();
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');

const config = require('config');
const User = require('../models/Users');

//@route     POST api/users
//@desc      Register a users
//@access    Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('studentID', 'Enter your ID').not().isEmpty(),
    check('password', 'Enter a password with 6 or more characters').isLength({min: 6}),
], async (req, res) => {
    // res.send(req.body);
    // const errors = validationResult(req);
    // if(!errors.isEmpty()) {
    //     return res.status(400).json({erros: errors.array()})
    // }

    const {name, email, studentID, password} = req.body;

    try {
        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: 'User already exists'});
        }

        user = new User ({
            name,
            email,
            studentID,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600000000}, (err, token) => {
            if (err) throw err;
            res.json({token});
        });
        // res.send('User saved');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route     GET api/users
//@desc      Get all users
//@access    Private
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find().sort({date: -1});
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;