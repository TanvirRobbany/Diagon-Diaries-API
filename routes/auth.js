const express = require('express');
const router = express.Router();
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const {check, validationResult} = require('express-validator');

const auth = require('../middleware/auth');
const config = require('config');
const User = require('../models/Users');
const { route } = require('./books');

//@route     GET api/auth
//@desc      Get logged in user
//@access    Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route     POST api/auth
//@desc      Auth user & get token
//@access    Public
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists(),


], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({erros: errors.array()})
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({msg: 'Invalid Credentials'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({msg: 'Invalid Credentials'});
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600}, (err, token) => {
            if (err) throw err;
            res.json({token, isAdmin: user.isAdmin, userID: user._id, userName: user.name, userId: user.studentID});
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/checkauth',[auth], (req, res) => {
    res.json(true);
});

module.exports = router;