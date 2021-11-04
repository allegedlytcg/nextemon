const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const {
	flipCoin,
	drawHand,
	getPrizeCards,
	shuffleDeck,
} = require('../gamelogic/common');

// @route     GET api/game/create
// @desc      GET game by roomId
// @access    public but only the socket server will call
router.get('/:roomId', async (req, res) => {
	const roomId = req.params.roomId;
	try {
		const game = await Game.findOne({ roomId });
		if (game) {
			res.status(200).json(game);
		}
		res.status(404).json({
			error: `game with roomId: ${roomId} not found`,
		});
	} catch (error) {
		res.status(500).json({
			error: 'server error',
		});
	}
});

// @route     POST api/game/create
// @desc      create game
// @access    public but only the socket server will call
router.post('/create', async (req, res) => {
	const { roomId, players } = req.body;
	const playerTransformer = players.map((player) => {
		const { socketId } = player;
		const shuffledCards = shuffleDeck(player.cards);
		const deckWithHand = drawHand(shuffledCards);
		const deckWithPrizeCards = getPrizeCards(deckWithHand);

		return { socketId, cards: deckWithPrizeCards };
	});

	try {
		const game = new Game({
			roomId,
			players: playerTransformer,
		});
		await game.save();
		res.status(201).json(game);
	} catch (error) {
		res.status(500).send(error.message);
	}
});

router.post('/flipcoin', (req, res) => {
	res.status(200).json({ result: flipCoin() });
});

module.exports = router;
