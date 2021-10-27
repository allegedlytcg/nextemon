const { leechSeed } = require('../attacks');

const getAttack = (userPokemon, opponentPokemon, chosenAttack) =>
	({
		[true]: () => {},
		['Leech Seed']: leechSeed(userPokemon, opponentPokemon, chosenAttack),
	}[chosenAttack]);

module.exports = { getAttack };
