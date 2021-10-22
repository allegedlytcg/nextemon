const { leechSeed } = require('../attacks');

export const getAttack = (userPokemon, opponentPokemon, chosenAttack) =>
	({
		[true]: () => {},
		['Leech Seed']: leechSeed(userPokemon, opponentPokemon, chosenAttack),
	}[chosenAttack]);
