export const baseUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://localhost:8080/api/v1'
		: 'https://allegedlytcg.herokuapp.com/api/v1';
