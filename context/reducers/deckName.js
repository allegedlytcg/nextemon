export const initialDeckName = '';

export const deckName = (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case 'SET_DECK_NAME':
			return payload;

		case 'RESET':
			return initialDeckName;
		default:
			return state;
	}
};
