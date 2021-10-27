const shuffle = require('lodash/shuffle');

const shuffleDeck = (deck) => shuffle(deck);

module.exports = {
	shuffleDeck,
};
