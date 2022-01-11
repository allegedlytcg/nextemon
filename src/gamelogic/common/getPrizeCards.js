const lodashFilter = require('lodash/filter');

const getPrizeCards = (deck) => {
	const filteredDeck = lodashFilter(deck, (card) => !card.isHand);
	const prizeCards = filteredDeck.slice(0, 6);
	const updatedDeck = lodashFilter(
		deck,
		(card) => !prizeCards.includes(card),
	);
	const updatedCards = prizeCards.map((card) => {
		return {
			...card,
			isPrizeCard: true,
		};
	});

	return [...updatedCards, ...updatedDeck];
};

module.exports = { getPrizeCards };
