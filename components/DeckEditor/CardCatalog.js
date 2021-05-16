import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Roller } from 'react-awesome-spinners';
import { GlobalContext } from '../../context/GlobalState';
import { buttons } from './utils/buttons';
import { cardClick } from './utils/cardClick';
import { getPokemon } from '../../services/PokemonService';
import FilterButton from '../common/FilterButton';

const CardCatalog = () => {
	const {
		cardCatalogState,
		cardCatalogDispatch,
		selectedCardDispatch,
		selectedCardState,
		existingDispatch,
		editingDeckDispatch,
		deckNameDispatch,
	} = useContext(GlobalContext);

	useEffect(() => {
		existingDispatch({ type: 'RESET' });
		editingDeckDispatch({ type: 'RESET' });
		deckNameDispatch({ type: 'RESET' });
		async function getState() {
			// we can move thse to the respective components later
			// i wanted to see how hitting the api worked here
			try {
				const pokemon = await getPokemon();
				cardCatalogDispatch({
					type: 'SET_INITIAL_CATALOG',
					payload: pokemon.data,
				});
			} catch (error) {}
		}

		getState();
		return () => {};
	}, []);

	const [filterButton, setFilterButton] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');
	const handleChange = (e) => {
		setFilterButton('All');
		setSearchTerm(e.target.value);
		const match = cardCatalogState.filter((c) =>
			c.name.toLowerCase().includes(e.target.value),
		);

		selectedCardDispatch({ type: 'SET_SELECTED_CARD', payload: match[0] });
	};

	const filterByType = (buttonText) => setFilterButton(buttonText);

	if (!cardCatalogState.length) {
		return (
			<AvailableCardsStyles>
				<div className='roller'>
					<Roller />
				</div>
			</AvailableCardsStyles>
		);
	}

	return (
		<>
			<AvailableCardsStyles>
				<p>
					<input
						onChange={handleChange}
						placeholder='Search...'
					></input>{' '}
					or Sort By
				</p>
				{buttons.map((buttonText) => {
					return (
						<FilterButton
							key={buttonText}
							clickHandler={filterByType}
							content={buttonText}
							color={filterButton === buttonText ? '#D84040' : ''}
						>
							{buttonText}
						</FilterButton>
					);
				})}
				{filterButton !== 'All' ? (
					<CardPool>
						{cardCatalogState
							.filter((card) => {
								if (card.supertype !== 'Pokémon') {
									return card.supertype === filterButton;
								} else {
									return card.types.includes(filterButton);
								}
							})
							.map((card) => {
								return (
									<div key={card.id} className='cards'>
										<img
											src={card.imageUrl}
											alt='card'
											onClick={() =>
												cardClick(
													card,
													selectedCardState,
													selectedCardDispatch,
												)
											}
										/>
									</div>
								);
							})}
					</CardPool>
				) : searchTerm ? (
					<CardPool>
						{cardCatalogState
							.filter((card) =>
								card.name.toLowerCase().includes(searchTerm),
							)
							.map((card) => {
								return (
									<div key={card.id} className='cards'>
										<img
											src={card.imageUrl}
											alt='card'
											onClick={() =>
												cardClick(
													card,
													selectedCardState,
													selectedCardDispatch,
												)
											}
										/>
									</div>
								);
							})}
					</CardPool>
				) : (
					<CardPool>
						{_.sortBy(
							cardCatalogState,
							'nationalPokedexNumber',
							'supertype',
							'name',
						).map((card) => {
							return (
								<div key={card.id} className='cards'>
									<img
										src={card.imageUrl}
										alt='card'
										onClick={() =>
											cardClick(
												card,
												selectedCardState,
												selectedCardDispatch,
											)
										}
									/>
								</div>
							);
						})}
					</CardPool>
				)}
			</AvailableCardsStyles>
		</>
	);
};

const AvailableCardsStyles = styled.div`
	margin: 0.5rem 1rem;
	cursor: pointer;
	button {
		/* margin: 0 1rem 1rem 0; */
		margin-right: 0.5rem;
		cursor: pointer;
	}
	input {
		height: 1.5rem;
		border-radius: 4px;
		border-style: none;
	}
	.roller {
		min-width: 45rem;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 75vh;
	}
`;

const CardPool = styled.div`
	display: flex;
	flex-wrap: wrap;

	min-width: 45rem;
	max-width: 45rem;
	max-height: 75vh;
	overflow: visible;
	overflow-x: hidden;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
	padding: 1rem 0 1rem 0;

	img {
		overflow: visible;
		width: 10rem;
		margin: 0 1rem 1rem 0;
		&:hover {
			transform: scale(1.2);
		}
	}
`;

export default CardCatalog;
