import React from 'react';
import Register from '../components/RegisterAndLogin/Register';
import Login from '../components/RegisterAndLogin/Login';
import styled from 'styled-components';

const RegisterAndLogin = () => {
	return (
		<RegisterAndLoginStyles>
			{/* <Container>
				<h2> Register</h2>

				<Register />
			</Container>
			<span className='border'></span> */}
			<Container>
				<h2>Login</h2>
				<Login />
			</Container>
		</RegisterAndLoginStyles>
	);
};

const Container = styled.div`
	h2 {
		text-align: center;
	}
`;

const RegisterAndLoginStyles = styled.div`
	display: flex;
	justify-content: center;
	span {
		margin: 3rem 1rem -1rem 1rem;
		border: 1px solid lightgray;
	}
`;

export default RegisterAndLogin;
