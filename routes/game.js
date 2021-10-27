const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const {
	flipCoin,
	drawHand,
	getPrizeCards,
	shuffleDeck,
} = require('../gamelogic/common');

// @route     GET api/deck/:id
// @desc      Get deck by deck id
// @access    private
router.get('/:id', async (req, res) => {
	// try {
	// 	let oneDeck = await Deck.findById(req.params.id);
	// 	if (!oneDeck) {
	// 		return res
	// 			.status(404)
	// 			.json({ message: 'cannot find deck with that id' });
	// 	}
	// 	res.status(200).json(oneDeck);
	// } catch (error) {
	// 	console.log(error.message);
	// 	res.status(500).send('server errror');
	// }
});

// @route     POST api/deck/
// @desc      create deck
// @access    private
router.post('/create', async (req, res) => {
	const { roomId, players } = req.body;
	const playerTransformer = players.map((player) => {
		const { socketId } = player;
		const shuffledCards = shuffleDeck(player.cards);
		const hand = drawHand(shuffledCards);

		return { socketId, cards: hand };
	});
	res.status(201).json({
		roomId,
		players: playerTransformer,
	});
	// try {
	// 	let game = new Game({
	// 		roomId,
	// 		players,
	// 	});
	// 	await game.save();
	// 	res.status(201).json(game);
	// } catch (error) {
	// 	console.log(error.message);
	// 	res.status(500).send('server errror');
	// }
});

module.exports = router;
