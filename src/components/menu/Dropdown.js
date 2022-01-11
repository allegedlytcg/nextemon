import React, {
	useState,
	useRef,
	useEffect,
	forwardRef,
	useContext,
} from 'react';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faHome,
	faTh,
	faSignOutAlt,
	faArrowLeft,
	faCog,
	faMoon,
} from '@fortawesome/free-solid-svg-icons';
import { config, library } from '@fortawesome/fontawesome-svg-core';
library.add(faUser, faHome, faTh, faSignOutAlt, faArrowLeft, faCog, faMoon);
// See https://github.com/FortAwesome/react-fontawesome#integrating-with-other-tools-and-frameworks
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
import { useRouter } from 'next/router';
import Link from 'next/link';

function DropdownMenu(props) {
	const { darkMode, toggleMode, logout, open, setOpen } = props;

	const [activeMenu, setActiveMenu] = useState('main');
	const [menuHeight, setMenuHeight] = useState(50);
	const user =
		typeof window !== 'undefined' ? localStorage.getItem('username') : null;

	const token =
		typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	const dropdownRef = useRef(null);
	const router = useRouter();

	function calcHeight(el) {
		const height = el.offsetHeight * 1.2;
		setMenuHeight(height);
	}
	useEffect(() => {
		setMenuHeight(dropdownRef.current?.firstChild.offsetHeight * 1.2);
	}, [token]); // not sure about u

	const DropdownItem = forwardRef(
		({ goToMenu, children, href, leftIcon }, ref) => {
			return (
				<a href={href} ref={ref}>
					<div
						className='menu-item'
						href={href}
						onClick={() => goToMenu && setActiveMenu(goToMenu)}
					>
						<span className='icon-button'>{leftIcon}</span>
						{children}
					</div>
				</a>
			);
		},
	);

	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (dropdownRef.current !== null) {
				if (dropdownRef.current.contains(e.target)) {
					return;
				} else {
					setOpen(!open);
				}
			}
		};
		if (open) {
			document.addEventListener('mousedown', handleOutsideClick, false);
		}
		return () => {
			document.removeEventListener(
				'mousedown',
				handleOutsideClick,
				false,
			);
		};
	}, [open, setOpen, router.pathname]);

	return (
		<DropDownStyles
			className='dropdown'
			style={{ height: menuHeight }}
			ref={dropdownRef}
		>
			{/* Dropdown lvl 1 */}
			<CSSTransition
				in={activeMenu === 'main'}
				timeout={500}
				classNames='menu-primary'
				unmountOnExit
				onEnter={calcHeight}
			>
				<div className='menu'>
					<h2>Main Menu</h2>
					{/* Someday this might link to password reset form  or maybe that goes into settings but so maybe avatars or sprites or something kewl*/}
					{user ? null : (
						<Link href='/registerandlogin' passHref>
							<DropdownItem
								leftIcon={
									<FontAwesomeIcon icon={faUser} size='2x' />
								}
							>
								Sign in / Create new account
							</DropdownItem>
						</Link>
					)}
					<Link href='/' passHref>
						<DropdownItem
							leftIcon={<FontAwesomeIcon icon={faHome} />}
						>
							Home
						</DropdownItem>
					</Link>
					<Link href='/deckeditor' passHref>
						<DropdownItem
							leftIcon={<FontAwesomeIcon icon={faTh} />}
						>
							Deck Editor
						</DropdownItem>
					</Link>
					<DropdownItem
						leftIcon={<FontAwesomeIcon icon={faCog} />}
						goToMenu='settings'
					>
						Settings
					</DropdownItem>
					{user ? (
						<DropdownItem
							leftIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
							goToMenu={logout}
						>
							Logout
						</DropdownItem>
					) : null}
				</div>
			</CSSTransition>

			{/* level 2 menus*/}
			{/* Settings */}
			<CSSTransition
				in={activeMenu === 'settings'}
				timeout={500}
				classNames='menu-secondary'
				unmountOnExit
				onEnter={calcHeight}
			>
				<div className='menu'>
					<DropdownItem
						goToMenu='main'
						leftIcon={<FontAwesomeIcon icon={faArrowLeft} />}
					>
						<h2>Main Menu</h2>
					</DropdownItem>
					<DropdownItem
						className='snowflake'
						leftIcon={<FontAwesomeIcon icon={faMoon} />}
					>
						Dark Mode{' '}
						<div onClick={toggleMode} className='dark-mode__toggle'>
							<div
								className={
									darkMode ? 'toggle toggled' : 'toggle'
								}
							/>
						</div>
					</DropdownItem>
				</div>
			</CSSTransition>

			{/* potential new menu leaving this example here commented out
			 */}
			{/* <CSSTransition
				in={activeMenu === 'animals'}
				timeout={500}
				classNames='menu-secondary'
				unmountOnExit
				onEnter={calcHeight}
			>
				<div className='menu'>
					<DropdownItem goToMenu='main' leftIcon={<ArrowIcon />}>
						<h2>Animals</h2>
					</DropdownItem>
					<DropdownItem leftIcon='🦘'>Kangaroo</DropdownItem>
					<DropdownItem leftIcon='🐸'>Frog</DropdownItem>
					<DropdownItem leftIcon='🦋'>Horse?</DropdownItem>
					<DropdownItem leftIcon='🦔'>Hedgehog</DropdownItem>
				</div>
			</CSSTransition> */}
		</DropDownStyles>
	);
}

const DropDownStyles = styled.div`
	a {
		color: black;
		text-decoration: none;
	}
	.menu {
		h2 {
			margin: 0 auto;
			text-align: center;
		}
	}
`;

export default DropdownMenu;
