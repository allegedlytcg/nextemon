export const initialSelectedCard = [];

export const selectedCard = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_SELECTED_CARD':
			return [payload];
		default:
			return state;
	}
};
