export const initialDeckId = '';

export const deckId = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_DECK_ID':
			return payload;

		case 'RESET':
			return initialDeckId;

		default:
			return state;
	}
};
