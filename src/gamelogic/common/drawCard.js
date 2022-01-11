const lodashFilter = require('lodash/filter');

const drawCard = (deck) => {
	const drawnCard = deck.slice(0, 1);
	const updatedDeck = lodashFilter(deck, (card) => !drawnCard.includes(card));
	return {
		drawnCard,
		updatedDeck,
	};
};

module.exports = { drawCard };
