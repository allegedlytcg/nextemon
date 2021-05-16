const useBrowserLogs = (arg, item) => {
	if (typeof window !== 'undefined') {
		return console.log(`${arg}: `, item);
	}
	return;
};

export default useBrowserLogs;
