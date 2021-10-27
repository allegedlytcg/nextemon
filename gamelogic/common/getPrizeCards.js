const lodashFilter = require('lodash/filter');

const getPrizeCards = (deck) => {
	const prizeCards = deck.slice(0, 6);
	const updatedDeck = lodashFilter(
		deck,
		(card) => !prizeCards.includes(card),
	);
	return {
		prizeCards,
		updatedDeck,
	};
};

module.exports = { getPrizeCards };
