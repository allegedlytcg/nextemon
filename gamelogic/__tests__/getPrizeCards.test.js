const { getPrizeCards } = require('../common');

test('should get top 6 cards of deck', () => {
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

	expect(getPrizeCards(deck.cards)).toStrictEqual([
		{ name: 'slowpoke' },
		{ name: 'pigeot' },
		{ name: 'arbok' },
		{ isPrizeCard: true, name: 'charmeleon' },
		{ isPrizeCard: true, name: 'wartortle' },
		{ isPrizeCard: true, name: 'mewtwo' },
		{ isPrizeCard: true, name: 'tentacruel' },
		{ isPrizeCard: true, name: 'aerodactyl' },
		{ isPrizeCard: true, name: 'omanyte' },
	]);
});
