import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Button = forwardRef(({ color, children, clickHandler, href }, ref) => {
	if (!color) color = '#72767D';

	if (href && ref) {
		return (
			<a href={href} ref={ref}>
				<StyledButton color={color || ''}>{children}</StyledButton>
			</a>
		);
	}

	if (clickHandler) {
		return (
			<StyledButton onClick={clickHandler} color={color || ''}>
				{children}
			</StyledButton>
		);
	}
	return <StyledButton color={color || ''}>{children}</StyledButton>;
});

const StyledButton = styled.button`
	background-color: ${(props) => props.color};
	border-style: none;
	/* padding: 1rem 2.5rem; */
	color: white;
	border-radius: 32px;
`;

export default Button;
