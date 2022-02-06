const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

// @route     POST api/users
// @desc      Register user
// @access    public
router.post('/register', async (req, res) => {
	const { name, password } = req.body;
	try {
		let user = await User.findOne({ name });
		if (user) {
			return res.status(400).send('user with that name already exists');
		}
		user = new User({
			name,
			password,
		});

		// hash password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		// authorize user on register

		const payload = {
			user: {
				id: user.id, //mongoose knows id is _id
				// user,
			},
		};
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: 360000,
			},
			(err, token) => {
				if (err) throw err;
				res.status(201).json({ name, token });
			},
		);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server errror');
	}
});

// @route     POST api/users
// @desc      login user
// @access    public
router.post('/login', async (req, res) => {
	const { name, password } = req.body;
	// console.log(name);
	try {
		// check if user exists
		console.log("Name passed to login is " + JSON.stringify(name));
		let user = await User.findOne({ name });
		if (!user) {
			return res.status(404).send('user not found');
		}

		// check if user's enter password = hashed password in database
		const isMatch = await bcrypt.compareSync(password, user.password);

		if (!isMatch) {
			return res.status(400).send('invalid credentials');
		}

		const payload = {
			user: {
				id: user.id, //mongoose knows id is _id
			},
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: 360000,
			},
			(err, token) => {
				if (err) throw err;
				res.status(201).json({ name, token });
			},
		);
		// this is a comment
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server errror');
	}
});

module.exports = router;
