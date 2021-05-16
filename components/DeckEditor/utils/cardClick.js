export const cardClick = (card, currentState, selectedCardDispatch) => {
	const singleCard = [...currentState, card];
	if (singleCard.length > 1) singleCard.shift();
	selectedCardDispatch({ type: 'SET_SELECTED_CARD', payload: card });
};
