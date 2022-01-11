import React, { useState } from 'react';

const useLocalStorage = (key, iniitialValue) => {
	const [storedValue, setStoredValue] = useState(() => {
		const obj =
			typeof window !== 'undefined'
				? window.localStorage.getItem(key)
				: null;
		return obj ? JSON.parse(obj) : iniitialValue;
	});
	const setValue = (value) => {
		setStoredValue(value);
		window.localStorage.setItem(key, JSON.stringify(value));
	};
	return [storedValue, setValue];
};

export default useLocalStorage;
