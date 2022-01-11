import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Roller } from 'react-awesome-spinners';
import { useToasts } from 'react-toast-notifications';
import { GlobalContext } from '../../context/GlobalState';
import {
	saveDeck,
	getUserDecks,
	updateDeck,
	deleteDeck,
} from '../../services/DeckService';
import Button from '../common/Button';

const EditingInfo = () => {
	const {
		deckNameState,
		deckNameDispatch,
		editingDeckState,
		editingDeckDispatch,
		existingState,
		existingDispatch,
		userDecksDispatch,
		deckIdState,
		deckIdDispatch,
	} = useContext(GlobalContext);

	const { addToast } = useToasts();

	const [loading, setLoading] = useState(false);

	const userInput = (e) => {
		deckNameDispatch({ type: 'SET_DECK_NAME', payload: e.target.value });
	};

	const handleSave = async () => {
		setLoading(true);
		const deckObj = {};
		deckObj.name = deckNameState;
		deckObj.cards = editingDeckState;
		try {
			const res = await saveDeck(deckObj);
			deckIdDispatch({ type: 'SET_DECK_ID', payload: res.data._id });
			const newDeck = await getUserDecks();
			userDecksDispatch({ type: 'SET_USER_DECKS', payload: newDeck });
			existingDispatch({ type: 'SET_EXISTING' });
			setLoading(false);
			addToast(`${deckObj.name} Successfully ${res.statusText}`, {
				appearance: 'success',
			});
		} catch (error) {
			console.log(error);
			addToast(error.message, { appearance: 'error' });
			setLoading(false);
		}
	};

	const handleUpdate = async () => {
		setLoading(true);
		const deckObj = {};
		deckObj.name = deckNameState;
		deckObj.cards = editingDeckState;
		try {
			const res = await updateDeck(deckIdState, deckObj);
			deckIdDispatch({ type: 'SET_DECK_ID', payload: res.data._id });
			console.log(res);
			const newDeck = await getUserDecks();
			userDecksDispatch({ type: 'SET_USER_DECKS', payload: newDeck });
			setLoading(false);
			addToast(`${deckObj.name} Successfully Updated`, {
				appearance: 'success',
			});
		} catch (error) {
			console.log(error);
			setLoading(false);
			addToast(error.message, { appearance: 'error' });
		}
	};

	const handleDelete = async () => {
		setLoading(true);
		try {
			await deleteDeck(deckIdState);
			const newDeck = await getUserDecks();
			userDecksDispatch({ type: 'SET_USER_DECKS', payload: newDeck });
			deckNameDispatch({ type: 'RESET' });
			editingDeckDispatch({ type: 'RESET' });
			existingDispatch({ type: 'RESET' });
			deckIdDispatch({ type: 'RESET' });
			setLoading(false);
			addToast(`${deckNameState} Successfully Deleted`, {
				appearance: 'success',
			});
		} catch (error) {
			console.log(error);
			setLoading(false);
			addToast(error.message, { appearance: 'error' });
		}
	};

	return (
		<EditingInfoStyles>
			<label style={{ display: 'flex' }}>
				Deck Name{' '}
				{deckNameState.length < 4 ? (
					<p className='validation'>
						* deck names must be at least 4 characters
					</p>
				) : null}
			</label>
			<StyledDiv>
				<input
					name='name'
					value={deckNameState}
					onChange={userInput}
				></input>

				{existingState === false ? (
					<ButtonCont>
						<Button color='#4CCA61' clickHandler={handleSave}>
							Save
						</Button>
					</ButtonCont>
				) : (
					<ButtonCont>
						<Button color='#4CCA61' clickHandler={handleUpdate}>
							Save
						</Button>

						<Button color='#D84040' clickHandler={handleDelete}>
							Delete
						</Button>
					</ButtonCont>
				)}
				<LoadingContainer>
					{loading ? <Roller></Roller> : null}
				</LoadingContainer>
			</StyledDiv>
		</EditingInfoStyles>
	);
};

const EditingInfoStyles = styled.div`
	margin: 1rem 0;
	input {
		height: 1rem;
		border-radius: 4px;
		border-style: none;
	}
	.validation {
		position: relative;
		color: red;
		font-size: 12px;
		margin-top: 0px;
	}
`;

const ButtonCont = styled.div`
	button {
		margin: 0 0 0 1rem;
		cursor: pointer;
		width: 5rem;
		height: 2rem;
		padding: none;
	}
`;

const StyledDiv = styled.div`
	display: flex;
	width: 100%;
	align-items: center;
	input {
		height: 1.5rem;
	}
`;

const LoadingContainer = styled.div`
	position: absolute;
	left: 69rem;
	top: 6rem;
`;

export default EditingInfo;
