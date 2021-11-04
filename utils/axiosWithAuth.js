import axios from 'axios';
import { baseUrl } from './baseUrl.js';

const axiosWithAuth = () => {
	const token = localStorage.getItem('token');

	return axios.create({
		baseURL: baseUrl,
		headers: {
			authorization: token,
		},
	});
};

export default axiosWithAuth;
