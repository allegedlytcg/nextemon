const { shuffleDeck } = require('../common');

test('should shuffle', () => {
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
	expect(shuffleDeck(deck.cards)).not.toStrictEqual(deck.cards);
});
