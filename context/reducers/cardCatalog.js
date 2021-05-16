export const initialCatalog = [];

export const cardCatalog = (state = initialCatalog, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_INITIAL_CATALOG':
			return [...payload];

		case 'RESET':
			state = initialCatalog;
			return state;

		default:
			return state;
	}
};
