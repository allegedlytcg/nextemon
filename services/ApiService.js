import { baseUrl } from '../utils/baseUrl';

const buildConfig = (config) => {
	return {
		...config,
		headers: { 'Content-Type': 'application/json' },
	};
};

const parseJson = (response) => {
	return new Promise((resolve) => {
		response
			.json()
			.then((json) =>
				resolve({
					status: response.status,
					statusText: response.statusText,
					json,
				}),
			)
			.catch((err) =>
				resolve({
					status: response.status,
					statusText: response.statusText,
					json: { message: 'invalid json response' },
				}),
			);
	});
};

const makeRequest = async (uri, config) => {
	const res = await fetch(baseUrl + uri, buildConfig(config))
		.then(parseJson)
		.then((res) => {
			if (res.status < 200 || res.status >= 300) {
				throw new Error(res.message);
			} else {
				return res;
			}
		})
		.catch((err) => console.log(err));
};

export const doGet = (uri) => {
	return makeRequest(uri, {
		method: 'GET',
	});
};

export const doPost = (uri, data) => {
	return makeRequest(uri, {
		method: 'POST',
		body: JSON.stringify(data),
	});
};

export const doPut = (uri, data) => {
	return makeRequest(uri, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
};

export const doDelete = (uri) => {
	return makeRequest(uri, {
		method: 'DELETE',
	});
};
