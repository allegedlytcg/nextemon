// import { doGet } from './ApiService';
import axios from 'axios';
import { baseUrl } from '../utils/baseUrl';

export const getPokemon = async () => {
	try {
		return await axios.get(`${baseUrl()}/pokemon`);
	} catch (error) {
		console.log('for sure error', error);
	}
};
