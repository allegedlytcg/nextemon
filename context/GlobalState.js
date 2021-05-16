import React, {
	useReducer,
	createContext,
	useState,
	useCallback,
	useEffect,
} from 'react';
import {
	cardCatalog,
	initialCatalog,
	selectedCard,
	initialSelectedCard,
	deckName,
	initialDeckName,
	userDecks,
	initialUserDecks,
	existing,
	initialExisting,
	deckId,
	initialDeckId,
	editingDeck,
	initialEdit,
} from './reducers';
import { getUserDecks } from '../services/DeckService';

export const GlobalContext = createContext();

export const GlobalState = (props) => {
	const [cardCatalogState, cardCatalogDispatch] = useReducer(
		cardCatalog,
		initialCatalog,
	);
	const [selectedCardState, selectedCardDispatch] = useReducer(
		selectedCard,
		initialSelectedCard,
	);
	const [editingDeckState, editingDeckDispatch] = useReducer(
		editingDeck,
		initialEdit,
	);
	const [deckNameState, deckNameDispatch] = useReducer(
		deckName,
		initialDeckName,
	);
	const [userDecksState, userDecksDispatch] = useReducer(
		userDecks,
		initialUserDecks,
	);

	const [existingState, existingDispatch] = useReducer(
		existing,
		initialExisting,
	);

	const [currentUser, setCurrentUser] = useState();

	const [deckIdState, deckIdDispatch] = useReducer(deckId, initialDeckId);

	const getState = useCallback(async () => {
		const user =
			typeof window === 'undefined'
				? localStorage.getItem('token')
				: null;
		if (user) {
			try {
				const userDecks = await getUserDecks();
				userDecksDispatch({
					type: 'SET_USER_DECKS',
					payload: userDecks,
				});
			} catch (error) {
				console.log(error);
			}
		}
	}, []);

	useEffect(() => {
		getState();
	}, []);

	return (
		<GlobalContext.Provider
			value={{
				cardCatalogState,
				cardCatalogDispatch,
				selectedCardState,
				selectedCardDispatch,
				editingDeckState,
				editingDeckDispatch,
				deckNameState,
				deckNameDispatch,
				userDecksState,
				userDecksDispatch,
				existingState,
				existingDispatch,
				deckIdState,
				deckIdDispatch,
				currentUser,
				setCurrentUser,
				// socket,
			}}
		>
			{props.children}
		</GlobalContext.Provider>
	);
};
