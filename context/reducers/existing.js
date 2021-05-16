export const initialExisting = false;

export const existing = (state, action) => {
	const { type, payload } = action;
	switch (type) {
		case 'SET_EXISTING':
			return true;

		case 'TOGGLE':
			return !payload;

		case 'RESET':
			return initialExisting;

		default:
			return state;
	}
};
