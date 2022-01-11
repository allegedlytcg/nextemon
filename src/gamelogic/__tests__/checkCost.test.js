const { checkCost } = require('../common');

test('bulbasaur: leech seed - pass', () => {
	const attachedEnergies = ['Grass', 'Grass'];
	const cost = ['Grass', 'Grass'];

	expect(checkCost(attachedEnergies, cost)).toBe(true);
});

test('bulbasaur: leech seed - fail', () => {
	const attachedEnergies = ['Grass', 'Fire'];
	const cost = ['Grass', 'Grass'];

	expect(checkCost(attachedEnergies, cost)).toBe(false);
});

test('ivysaur: vinewhip - pass', () => {
	const attachedEnergies = ['Grass', 'Fire', 'Water'];
	const cost = ['Grass', 'Colorless', 'Colorless'];

	expect(checkCost(attachedEnergies, cost)).toBe(true);
});

test('ivysaur: vinewhip - fail', () => {
	const attachedEnergies = ['Fire', 'Water'];
	const cost = ['Grass', 'Colorless', 'Colorless'];

	expect(checkCost(attachedEnergies, cost)).toBe(false);
});

test('venusaur: solarbeem - pass', () => {
	const attachedEnergies = ['Grass', 'Grass', 'Grass', 'Grass'];
	const cost = ['Grass', 'Grass', 'Grass', 'Grass'];

	expect(checkCost(attachedEnergies, cost)).toBe(true);
});

test('charmander: scratch - pass', () => {
	const attachedEnergies = ['Lightning'];
	const cost = ['Colorless'];

	expect(checkCost(attachedEnergies, cost)).toBe(true);
});

test('charmander: ember - pass', () => {
	const attachedEnergies = ['Fire', 'Colorless'];
	const cost = ['Fire', 'Colorless'];

	expect(checkCost(attachedEnergies, cost)).toBe(true);
});
