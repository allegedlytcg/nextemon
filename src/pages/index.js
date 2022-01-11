import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import Button from '../components/common/Button';

export default function Home() {
	return (
		<div>
			<Head>
				<title>Allegedly TCG</title>
				<link rel='icon' href='/favicon.ico' />

				<link
					href='https://use.fontawesome.com/releases/v5.15.3/css/svg-with-js.css'
					rel='stylesheet'
				></link>
			</Head>
			<StyledHome>
				<h1>Welcome to Allegedly TCG</h1>
				<div className='buttons'>
					<Link href='/registerandlogin'>
						<Button
							href='/registerandlogin'
							color='#4CCA61'
							passHref
						>
							Register/Login
						</Button>
					</Link>
					<Link href='/deckeditor'>
						<Button href='/deckeditor' color='#4CCA61' passHref>
							Deck Editor
						</Button>
					</Link>
					<p>coming soon</p>
					<Link href='/game'>
						<Button href='/game' color='#4CCA61' passHref>
							Play
						</Button>
					</Link>
				</div>
			</StyledHome>
		</div>
	);
}

const StyledHome = styled.div`
	margin: 0 auto;
	h1 {
		text-align: center;
	}
	.buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		button {
			margin: 1rem;
			width: 10rem;
			padding: 1rem 2rem;
		}
	}
`;
