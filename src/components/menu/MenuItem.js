import React, { useContext } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false; /* eslint-disable import/first */
import useLoaded from '../../utils/useLoaded';

function MenuItem(props) {
	const { open, setOpen } = props;
	const user =
		typeof window !== 'undefined' ? localStorage.getItem('username') : null;
	const loaded = useLoaded();
	if (!loaded) return null;
	return (
		<StyledMenuItem>
			{user ? (
				<div className='user'>
					<FontAwesomeIcon icon={faUser} />
					{user}
				</div>
			) : null}
			<div className='icon-button' onClick={() => setOpen(!open)}>
				{props.icon}
			</div>
			{open && props.children}
		</StyledMenuItem>
	);
}

const StyledMenuItem = styled.li`
	display: flex;
	align-items: center;
	justify-content: center;

	.user {
		svg {
			margin: 0 1rem;
			color: rgb(120, 122, 128);
		}
		margin: 1rem;
	}
`;

export default MenuItem;
