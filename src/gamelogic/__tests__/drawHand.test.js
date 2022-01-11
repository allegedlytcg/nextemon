const { drawHand } = require('../common');

test('should get top 7 cards of deck', () => {
	const deck = {
		cards: [
			{ name: 'charmeleon' },
			{ name: 'wartortle' },
			{ name: 'mewtwo' },
			{ name: 'tentacruel' },
			{ name: 'aerodactyl' },
			{ name: 'omanyte' },
			{ name: 'slowpoke' },
			{ name: 'pigeot' },
			{ name: 'arbok' },
		],
	};
	expect(drawHand(deck.cards)).toStrictEqual({
		hand: [
			{ name: 'charmeleon' },
			{ name: 'wartortle' },
			{ name: 'mewtwo' },
			{ name: 'tentacruel' },
			{ name: 'aerodactyl' },
			{ name: 'omanyte' },
			{ name: 'slowpoke' },
		],
		updatedDeck: [{ name: 'pigeot' }, { name: 'arbok' }],
	});
});
