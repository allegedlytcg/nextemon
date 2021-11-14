require('dotenv').config({ path: require('find-config')('.env') });
const { MongoClient } = require('mongodb');
const gameDoc = require('../sample_docs/game.json');
const { flipCoin, drawHand, getPrizeCards, shuffleDeck } = require('../common');

const createGame = ({ roomId = '', players = [] }) => {
	try {
		MongoClient.connect(
			process.env.MONGO_DB,
			{ useUnifiedTopology: true },
			async (err, db) => {
				if (err) throw err;
				const gameDb = db.db('test');

				const collection = gameDb.collection('games');
				const existing = await collection.findOne({ roomId });

				if (existing !== null) {
					db.close();
					console.log(`game with roomId: ${roomId} aleady exists`);
					return {
						message: `game with roomId: ${roomId} aleady exists`,
					};
				}

				const playerTransformer = players.map((player) => {
					const { socketId } = player;
					const shuffledCards = shuffleDeck(player.cards);
					const deckWithHand = drawHand(shuffledCards);
					const deckWithPrizeCards = getPrizeCards(deckWithHand);

					return {
						socketId,
						cards: deckWithPrizeCards,
						turn: false,
					};
				});

				const newGame = {
					roomId,
					players: playerTransformer,
				};

				await collection.insertOne(newGame);
				db.close();
			},
		);
		return {
			gameStatus: 'created',
		};
	} catch (error) {
		return error;
	}
};

module.exports = { createGame };
