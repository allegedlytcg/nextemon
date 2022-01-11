import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Button from '../common/Button';
const Register = () => {
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

	const userRegistration = (e) => {
		e.preventDefault();
		axios
			.post(
				`https://alleged-mongo-backend.herokuapp.com/api/v1/user/register`,
				user,
			)
			.then((res) => {
				setCookie(
					'user',
					{ username: res.data.name, auth: res.data.token },
					{ path: '/' },
				);
				router.push('/');
			})
			.catch((err) => console.log(err, 'for sure error'));
	};

	return (
		<RegisterStyles>
			<form onSubmit={userRegistration}>
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
						Register
					</Button>
				</div>
			</form>
		</RegisterStyles>
	);
};
const RegisterStyles = styled.div`
	align-items: center;
	margin: 2rem 2rem 1rem 1rem;
	border-radius: 14px;
	padding: 1rem;
	background-color: #726ca8;
	color: #fff;

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
export default Register;
