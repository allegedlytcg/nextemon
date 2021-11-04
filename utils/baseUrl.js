const NODE_ENV = process.env.NODE_ENV || '';
console.log(NODE_ENV);

export const baseUrl = () =>
	({
		['development']: 'http://localhost:8080/api/v1',
		['dev']: 'https://allegedlytcg-dev.herokuapp.com/api/v1',
		['production']: 'https://allegedlytcg.herokuapp.com/api/v1',
	}[NODE_ENV]);
