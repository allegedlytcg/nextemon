import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

import nprogress, { set } from 'nprogress';
import Router from 'next/router';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import Dropdown from '../menu/Dropdown';
import useDarkMode from '../../utils/useDarkMode';
import useWindowSize from '../../utils/useWindowSize';

function Layout({ children }) {
	Router.onRouteChangeStart = () => nprogress.start();
	Router.onRouteChangeComplete = () => nprogress.done();
	Router.onRouteChangeError = () => nprogress.done();

	const [open, setOpen] = useState(false);
	const [darkMode, setDarkMode] = useDarkMode(false);

	const toggleMode = (e) => {
		e.preventDefault();
		setDarkMode(!darkMode);
	};
	const windowSize = useWindowSize();

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		window.location.reload();
		setOpen(!open);
	};

	return (
		<>
			{windowSize.width <= 1605 ? (
				<h1>for sure get on a desktop</h1>
			) : (
				<>
					<Menu>
						<MenuItem
							open={open}
							setOpen={setOpen}
							icon={<FontAwesomeIcon icon={faCaretDown} />}
						>
							<Dropdown
								toggleMode={toggleMode}
								darkMode={darkMode}
								logout={logout}
								open={open}
								setOpen={setOpen}
							/>
						</MenuItem>
					</Menu>
					<>{children}</>
				</>
			)}
		</>
	);
}
export default Layout;
