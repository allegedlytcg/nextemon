const checkCost = (attached, required) => {
	const energies = { Colorless: 0 };
	const req = {};

	for (const energy of attached) {
		if (!energies[energy]) {
			energies[energy] = 0;
		}
		energies[energy]++;
		energies.Colorless++;
	}

	for (const energy of required) {
		if (!req[energy]) {
			req[energy] = 0;
		}
		req[energy]++;
	}

	for (const energy in req) {
		if (req[energy] <= energies[energy]) return true;
		return false;
	}
};

module.exports = { checkCost };
