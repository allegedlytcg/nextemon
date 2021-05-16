import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

function Menu(props) {
	return (
		<MenuStyles>
			<nav className='navbar'>
				<h3>
					<Link href='/'>Allgedly TCG</Link>
				</h3>
				<ul className='navbar-nav'>{props.children}</ul>
			</nav>
		</MenuStyles>
	);
}

const MenuStyles = styled.div`
	width: 100%;
	.navbar {
		height: 4rem;
		background-color: lavender;
		padding: 0 1rem;
		border-bottom: 1px #6e6b6b;
		box-shadow: 3px 3px 8px 2px #ccc;

		h3 {
			position: absolute;
			margin-left: 1rem;
		}
	}

	.navbar-nav {
		height: 100%;
		display: flex;
		justify-content: flex-end;
	}
`;

export default Menu;
