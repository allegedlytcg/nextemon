const lodashFilter = require('lodash/filter');

export const drawCard = (deck) => {
	const drawnCard = deck.slice(0, 1);
	const updatedDeck = lodashFilter(deck, (card) => !drawnCard.includes(card));
	return {
		drawnCard,
		updatedDeck,
	};
};
