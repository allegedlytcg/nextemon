const { getAttack } = require('../common');

jest.useFakeTimers('legacy');
describe('get attack method', () => {
	test('should perform leech seed', () => {
		const userPokemon = {
			name: 'Bulbasaur',
			hp: '40',
			currentHP: 30,
			attacks: [
				{
					name: 'Leech Seed',
					cost: ['Grass', 'Grass'],
					convertedEnergyCost: 2,
					damage: '20',
					text: ' Unless all damage from this attack is prevented, you may remove 1 damage counter from Bulbasaur',
				},
			],
			attachedEnergies: ['Grass', 'Normal', 'Fire', 'Grass'],
		};

		const opponentPokemon = {
			name: 'Squirtle',
			currentHP: '40',
			weaknesses: [{ type: 'Lightning', value: 'x2' }],
		};

		const expected = [
			{
				name: 'Bulbasaur',
				hp: '40',
				currentHP: 40,
				attacks: [
					{
						name: 'Leech Seed',
						cost: ['Grass', 'Grass'],
						convertedEnergyCost: 2,
						damage: '20',
						text: ' Unless all damage from this attack is prevented, you may remove 1 damage counter from Bulbasaur',
					},
				],
				attachedEnergies: ['Grass', 'Normal', 'Fire', 'Grass'],
			},
			{
				name: 'Squirtle',
				currentHP: 20,
				weaknesses: [{ type: 'Lightning', value: 'x2' }],
			},
		];
		const result = getAttack(userPokemon, opponentPokemon, 'Leech Seed');
		expect(result).toStrictEqual(expected);
	});

	test('should return null when leech seed is called without required energies', () => {
		const userPokemon = {
			name: 'Bulbasaur',
			hp: '40',
			currentHP: 30,
			attacks: [
				{
					name: 'Leech Seed',
					cost: ['Grass', 'Grass'],
					convertedEnergyCost: 2,
					damage: '20',
					text: ' Unless all damage from this attack is prevented, you may remove 1 damage counter from Bulbasaur',
				},
			],
			attachedEnergies: ['Grass', 'Normal', 'Fire'],
		};

		const opponentPokemon = {};

		const result = getAttack(userPokemon, opponentPokemon, 'Leech Seed');
		expect(result).toBeNull();
	});
});
