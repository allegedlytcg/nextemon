const { checkCost } = require('./common/checkCost');

// Unless all damage from this attack is prevented,
// you may remove 1 damage counter from Bulbasaur.
export const leechSeed = (
	userPokemon,
	opponentPokemon,
	chosenAttack = 'Leech Seed',
) => {
	const attack = userPokemon.attacks.find((a) => a.name === chosenAttack);
	if (!attack) return null;

	// check cost
	if (checkCost(userPokemon.attachedEnergies, attack.cost)) {
		const weaknesses = opponentPokemon.weaknesses.find(
			(w) => w.type === 'Grass',
		) || { type: '', value: '' };

		// subtract damage from opponents current hp
		if (weaknesses.type === 'Grass') {
			opponentPokemon.currentHP =
				opponentPokemon.currentHP - parseInt(attack.damage) * 2;
		} else {
			opponentPokemon.currentHP =
				opponentPokemon.currentHP - parseInt(attack.damage);
		}

		// add 10hp back to user
		if (userPokemon.currentHP < userPokemon.hp) {
			userPokemon.currentHP = userPokemon.currentHP + 10;
		}

		return [userPokemon, opponentPokemon];
	}
	return null;
};
