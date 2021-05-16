import { pullAt, indexOf } from 'lodash';
import { checkNumInDeck } from '../../components/DeckEditor/utils/checkNumInDeck';

export const initialEdit = [];

export const editingDeck = (state, action) => {
	const { type, payload, currentState, card } = action;
	switch (type) {
		case 'SET_EDITING_DECK':
			return payload;

		case 'ADD_TO_EDIT':
			if (
				card.supertype !== 'Energy' ||
				card.name === 'Double Colorless Energy'
			) {
				let check = checkNumInDeck(card, currentState);
				if (check === false) return currentState;
			}
			if (currentState.length === 60) return currentState;

			let updated = [...currentState, card];

			return updated;

		case 'REMOVE_FROM_EDIT':
			const newDeck = [...currentState];
			let cardIndex = indexOf(newDeck, card);
			if (cardIndex === -1) {
				for (let c in newDeck) {
					if (newDeck[c].name === card.name) {
						cardIndex = indexOf(newDeck, newDeck[c]);
					}
				}
			}
			pullAt(newDeck, cardIndex);
			return newDeck;

		case 'RESET':
			return initialEdit;
		default:
			return state;
	}
};
