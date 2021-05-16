import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Roller } from 'react-awesome-spinners';
import Image from 'next/image';
import { GlobalContext } from '../../context/GlobalState';
import { checkQuantity } from './utils/checkQuantity';
import Button from '../common/Button.js';

const SingleCard = () => {
	const {
		selectedCardState,
		selectedCardDispatch,
		cardCatalogState,
		editingDeckState,
		editingDeckDispatch,
	} = useContext(GlobalContext);

	useEffect(() => {
		selectedCardDispatch({
			type: 'SET_SELECTED_CARD',
			payload: cardCatalogState[0],
		});
		return () => {};
	}, [cardCatalogState, selectedCardDispatch]);

	if (!selectedCardState.length) return <Roller size={500} />;

	return (
		<>
			{selectedCardState.map((card) => {
				if (!card)
					return (
						<div
							key={'bust'}
							style={{
								width: '100%',
							}}
						>
							<Roller></Roller>
						</div>
					);
				return (
					<div key={card._id}>
						<SingleCardStyles key={card.imageUrl}>
							<div className='center'>
								<img src={card.imageUrl} alt='selected card' />
								<ButtonBar>
									<ButtonContainer>
										<Button
											color='#4CCA61'
											clickHandler={() =>
												editingDeckDispatch({
													type: 'ADD_TO_EDIT',
													currentState: editingDeckState,
													card,
												})
											}
										>
											Add
										</Button>
										<span></span>
										<Button
											clickHandler={() =>
												editingDeckDispatch({
													type: 'REMOVE_FROM_EDIT',
													currentState: editingDeckState,
													card,
												})
											}
											color='#D84040'
										>
											Remove
										</Button>
									</ButtonContainer>
								</ButtonBar>
							</div>
							<div className='card-info'>
								<div className='card-title'>
									<h2>
										{card.name}{' '}
										<span className='hp'>
											{card.hp && card.hp} HP
										</span>
									</h2>
									<h3>
										Number in Deck:{' '}
										<span className='numindeck'>
											{card.supertype === 'Energy'
												? card.name ===
												  'Double Colorless Energy'
													? `${checkQuantity(
															card,
															editingDeckState,
													  )}/4`
													: checkQuantity(
															card,
															editingDeckState,
													  )
												: `${checkQuantity(
														card,
														editingDeckState,
												  )}/4`}
										</span>
									</h3>
								</div>
								{card.text ? (
									<p>
										Description: <br></br>
										{card.text}
									</p>
								) : null}
								<div className='basic-info'>
									<div className='primary-info'>
										{card.types && (
											<TextLineStyles>
												<p>
													Type:{' '}
													{card.types
														? card.types[0]
														: null}
												</p>{' '}
												<span className='divider'></span>
												<Image
													src={`/images/${card?.types[0]?.toLowerCase()}.png`}
													height='20'
													width='20'
												></Image>
											</TextLineStyles>
										)}
										{card.subtype && (
											<p>Subtype: {card.subtype}</p>
										)}
										{card.evolvesFrom && (
											<TextLineStyles>
												Evolves from:
												<span className='divider'></span>
												<span
													style={{
														color: '#FED300',
														fontWeight: 'bold',
													}}
												>
													{card.evolvesFrom}
												</span>
											</TextLineStyles>
										)}
									</div>
									<div className='secondary-info'>
										{card.weaknesses &&
											card.weaknesses.map(
												(weakness, index) => {
													return (
														<TextLineStyles
															key={index}
														>
															<p>Weakeness: </p>{' '}
															<span className='divider'></span>
															<Image
																src={`/images/${weakness.type.toLowerCase()}.png`}
																height='20'
																width='20'
															></Image>{' '}
															<p>
																{weakness.value}
															</p>
														</TextLineStyles>
													);
												},
											)}
										{card.convertedRetreatCost && (
											<TextLineStyles>
												<p>Retreat Cost: </p>
												<span className='divider'></span>
												{card.retreatCost.map(
													(c, index) => {
														return (
															<div key={index}>
																<Image
																	src={`/images/${c?.toLowerCase()}.png`}
																	height='20'
																	width='20'
																></Image>
																<span className='divider'></span>
															</div>
														);
													},
												)}
											</TextLineStyles>
										)}
										{card.resistances &&
											card.resistances.map(
												(resistance, index) => {
													return (
														<TextLineStyles
															key={index}
														>
															<p>
																Resistance:{' '}
																{
																	resistance.type
																}
															</p>
															<span className='divider'></span>
															<Image
																src={`/images/${resistance.type.toLowerCase()}.png`}
																height='20'
																width='20'
															></Image>
															<span className='divider'></span>
															{resistance.value}
														</TextLineStyles>
													);
												},
											)}
									</div>
								</div>
								{card.ability ? (
									<>
										<br></br>
										<h4 style={{ color: '#529CED' }}>
											Pokemon Power:
										</h4>
										<p>
											{card.ability.name}{' '}
											{card.ability.text}
										</p>
									</>
								) : null}
								{card.attacks
									? card.attacks.map((attack, index) => {
											return (
												<div key={index}>
													<div
														key={index}
														className='attack-info'
													>
														<div className='primary-attack'>
															<h4
																style={{
																	color:
																		'#D84040',
																}}
															>
																{attack.name}
															</h4>
															<TextLineStyles>
																<p>Cost: </p>{' '}
																<span className='divider'></span>
																{attack.cost.map(
																	(
																		c,
																		index,
																	) => (
																		<div
																			key={
																				index
																			}
																		>
																			<Image
																				src={`/images/${c.toLowerCase()}.png`}
																				height='20'
																				width='20'
																			></Image>
																			<span className='divider'></span>
																		</div>
																	),
																)}
															</TextLineStyles>
															{attack.damage ? (
																<p>
																	Damage:{' '}
																	<span
																		style={{
																			color:
																				'#FED300',
																			fontWeight:
																				'bold',
																		}}
																	>
																		{
																			attack.damage
																		}
																	</span>
																</p>
															) : null}
														</div>
														<div className='secondary-attack'>
															{attack.text ? (
																<p>
																	Description:{' '}
																	{
																		attack.text
																	}
																</p>
															) : null}
														</div>
													</div>
												</div>
											);
									  })
									: null}
							</div>
						</SingleCardStyles>
					</div>
				);
			})}
		</>
	);
};

const TextLineStyles = styled.div`
	display: flex;
	align-items: center !important;

	width: 20rem;
	.divider {
		margin: 0 0 0 5px;
	}
	img {
		min-width: 16px !important;
		min-height: 16px !important;
		max-width: 16px !important;
		width: 16px;
		height: 16px;
		border-radius: 50%;
	}
`;

const SingleCardStyles = styled.div`
	display: flex;
	flex-direction: row;
	p {
		margin: 0;
	}
	img {
		width: 20rem;
		min-height: 440px;
	}
	.numindeck {
		color: #4cca61;
	}
	.hp {
		color: #d84040;
	}

	.card-info {
		margin: 0 0 0 1rem;
		width: 20rem;
		overflow: auto;
		overflow-x: hidden;

		.basic-info {
			.secondary-info {
				margin: 0;
			}
		}
		.primary-info {
			width: 8rem;
			margin: 0;
		}
		.attack-info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			margin-top: 1rem;
		}

		h5 {
			margin: 0rem 0rem;
		}
		h2 {
			margin: 0;
		}
		h3 {
			margin: 0;
		}
		h4 {
			margin: 0;
		}
	}
	button {
		margin: 1rem 0;
		max-width: 2rem;
		max-height: 2rem;
		cursor: pointer;
	}
	.center {
		display: flex;
		flex-direction: column;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	width: 100%;

	button {
		padding: 0.5rem 1rem;
		min-width: 7rem;
	}

	span {
		margin: 0.25rem;
	}
`;

const ButtonBar = styled.div`
	h4 {
		margin-top: 0.5rem;
	}
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export default SingleCard;
