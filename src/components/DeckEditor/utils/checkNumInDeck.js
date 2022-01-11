export const checkNumInDeck = (card, currentState) => {
	let duplicate = 0;
	for (let i = 0; i < currentState.length; i++) {
		if (currentState[i].name === card.name && duplicate < 3) {
			duplicate = duplicate + 1;
		} else if (duplicate === 3) {
			return false;
		}
	}
	return true;
};
