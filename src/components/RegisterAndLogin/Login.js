import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Button from '../common/Button';
import { baseUrl } from '../../utils/baseUrl';

const Login = () => {
	const router = useRouter();
	const [user, setUser] = useState({
		name: '',
		password: '',
	});

	const userInput = (e) => {
		setUser({
			...user,
			[e.target.name]: e.target.value,
		});
	};
	const userLogin = (e) => {
		e.preventDefault();
		axios
			.post(`${baseUrl}/user/login`, user)
			.then((res) => {
				localStorage.setItem('username', res.data.name);
				localStorage.setItem('token', res.data.token);
				router.push('/');
			})
			.catch((err) => console.log(err, 'for sure error'));
	};

	return (
		<LoginStyles>
			<form onSubmit={userLogin}>
				<div className='labelAndInput'>
					<label>username</label> <br />
					<input
						name='name'
						placeholder='username'
						type='text'
						onChange={userInput}
						value={user.name}
						autoComplete='off'
					/>
				</div>
				<br />
				<div className='labelAndInput'>
					<label>password</label> <br />
					<input
						name='password'
						placeholder='password'
						type='password'
						onChange={userInput}
						value={user.password}
						autoComplete='off'
					/>
				</div>
				<br />
				<div className='buttonDiv'>
					<Button color='#1F2022' size='small'>
						Log in
					</Button>
				</div>
			</form>
		</LoginStyles>
	);
};

const LoginStyles = styled.div`
	margin: 2rem 1rem 1rem 2rem;
	border-radius: 14px;
	background-color: #726ca8;
	color: #fff;
	padding: 1rem;

	.labelAndInput {
		input {
			border-radius: 0.25rem;
			border-style: none;
			padding: 0.25rem 0.25rem 0.25rem 0.5rem;
		}
	}
	.buttonDiv {
		display: flex;
		justify-content: center;
		button {
			width: 5rem;
			height: 2rem;
		}
	}
`;

export default Login;
