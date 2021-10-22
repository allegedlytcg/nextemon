const lodashFilter = require('lodash/filter');

export const drawHand = (deck) => {
	const hand = deck.slice(0, 7);
	const updatedDeck = lodashFilter(deck, (card) => !hand.includes(card));
	return {
		hand,
		updatedDeck,
	};
};
