const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Deck = require('../models/Deck');
const User = require('../models/User');

// @route     GET api/deck/me
// @desc      Get all user decks
// @access    private
router.get('/me', auth, async (req, res) => {
	// console.log(req);
	try {
		let deck = await Deck.find({ user: req.user.id });
		if (!deck) {
			return res.status(404).json({ message: 'deck for user not found' });
		}
		res.status(200).json(deck);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server errror');
	}
});

// @route     GET api/deck/:id
// @desc      Get deck by deck id
// @access    private
router.get('/:id', auth, async (req, res) => {
	try {
		let oneDeck = await Deck.findById(req.params.id);
		if (!oneDeck) {
			return res
				.status(404)
				.json({ message: 'cannot find deck with that id' });
		}
		res.status(200).json(oneDeck);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server errror');
	}
});

// @route     POST api/deck/
// @desc      create deck
// @access    private
router.post('/', auth, async (req, res) => {
	const { name, cards } = req.body;
	try {
		let deck = new Deck({
			user: req.user.id,
			name,
			cards,
		});
		await deck.save();
		res.status(201).json(deck);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server errror');
	}
});

// @route     DELETE api/deck/:id
// @desc      delete deck by id
// @access    private
router.delete('/:id', auth, async (req, res) => {
	try {
		await Deck.findOneAndDelete({ _id: req.params.id });
		res.json({ message: 'deck successfully deleted' });
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server errror');
	}
});

// @route     PUT api/deck/
// @desc      edit deck by id
// @access    private
router.put('/:id', auth, async (req, res) => {
	let check = req.body.cards;
	if (check.length) {
		try {
			let deck = await Deck.findOneAndUpdate(
				{ _id: req.params.id },
				req.body,
				{ new: true },
			);

			res.status(201).json(deck);
		} catch (error) {
			console.log(error.message);
			res.status(500).send('server errror');
		}
	} else {
		res.status(500).send('servor error');
	}
});

module.exports = router;
