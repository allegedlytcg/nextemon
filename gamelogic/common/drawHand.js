const lodashFilter = require('lodash/filter');

const drawHand = (deck) => {
	const hand = deck.slice(0, 7);
	const updatedDeck = lodashFilter(deck, (card) => !hand.includes(card));

	const hasBasicPokemon = hand.some(
		(card) => card.supertype === 'Pokémon' && card.subtype === 'Basic',
	);

	if (!hasBasicPokemon) {
		drawHand(deck);
	} else {
		const updatedHand = hand.map((card) => {
			return {
				...card,
				isHand: true,
			};
		});

		return [...updatedHand, ...updatedDeck];
	}
};

module.exports = { drawHand };
