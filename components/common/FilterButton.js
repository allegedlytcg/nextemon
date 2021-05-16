import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

const FilterButton = ({ content, color, clickHandler }) => {
	if (!color) color = '#72767D';

	return (
		<StyledButton color={color} onClick={() => clickHandler(content)}>
			<Container>
				<Image
					src={`/images/${content.toLowerCase()}.png`}
					className='elementimg'
					height={20}
					width={20}
				></Image>{' '}
				<p>{content}</p>
			</Container>
		</StyledButton>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	.elementimg {
		border-radius: 50%;
	}
	p {
		margin-left: 0.25rem;
	}
`;

const StyledButton = styled.button`
	background-color: ${(props) => props.color};
	border-style: none;
	color: white;
	border-radius: 16px;
	padding: 0.3rem;
	width: 8rem;
	text-align: center;
	margin: 1rem 0.25rem 0.25rem 0;
`;

export default FilterButton;
