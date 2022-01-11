import React from 'react';
import styled from 'styled-components';
import {
	CardCatalog,
	SingleCard,
	EditingInfo,
	EditingCards,
	MyDecksDropDown,
	StarterDeckDropDown,
} from '../components/DeckEditor';

const DeckEditor = () => {
	return (
		<>
			<Container>
				<CardCatalog />
				<CenterContainer>
					<DropdownContainer>
						<MyDecksDropDown />
						<StarterDeckDropDown />
					</DropdownContainer>
					<EditingInfo />
					<div style={{ display: 'flex' }}>
						<SingleCard />
					</div>
				</CenterContainer>
				<EditingStyles>
					<EditingCards />
				</EditingStyles>
			</Container>
		</>
	);
};

// css yo
const Container = styled.div`
	display: flex;
`;

const CenterContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin: 0rem 1rem 0rem 0.4rem;
`;

const EditingStyles = styled.div`
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: flex-end;
	width: 100%;
`;

const DropdownContainer = styled.div`
	margin-top: 0.5rem;
	display: flex;
`;

export default DeckEditor;
