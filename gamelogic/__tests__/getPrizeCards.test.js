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

	expect(getPrizeCards(deck.cards)).toStrictEqual({
		prizeCards: [
			{ name: 'charmeleon' },
			{ name: 'wartortle' },
			{ name: 'mewtwo' },
			{ name: 'tentacruel' },
			{ name: 'aerodactyl' },
			{ name: 'omanyte' },
		],
		updatedDeck: [
			{
				name: 'slowpoke',
			},
			{
				name: 'pigeot',
			},
			{
				name: 'arbok',
			},
		],
	});
});
