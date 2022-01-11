export const checkQuantity = (card, currentState) => {
	if (currentState.length <= 0) return 0;
	let duplicate = 0;
	for (let i = 0; i < currentState.length; i++) {
		if (currentState[i].name === card.name) {
			duplicate = duplicate + 1;
		}
	}
	return duplicate;
};
