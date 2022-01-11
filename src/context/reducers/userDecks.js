export const initialUserDecks = [];

export const userDecks = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_USER_DECKS':
			return [...payload];

		case 'RESET':
			return initialUserDecks;

		default:
			return state;
	}
};
