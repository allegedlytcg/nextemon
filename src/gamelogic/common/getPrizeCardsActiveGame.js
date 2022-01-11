const lodashFilter = require('lodash/filter');

const getPrizeCardsActiveGame = (deck) => {
	const filteredPrizeCards = lodashFilter(deck, (card) => card.isPrizeCard);
	return [...filteredPrizeCards];
};

module.exports = { getPrizeCardsActiveGame };
