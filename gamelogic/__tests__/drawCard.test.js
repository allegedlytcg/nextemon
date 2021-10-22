const { drawCard } = require('../common');

const deck = {
	cards: [{ name: 'pikachu' }, { name: 'bulbasaur' }],
};

test('should draw card', () => {
	expect(drawCard(deck.cards)).toStrictEqual({
		drawnCard: [{ name: 'pikachu' }],
		updatedDeck: [{ name: 'bulbasaur' }],
	});
});
