const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
	// get token from header
	const token = req.header('authorization');
	// console.log(token)

	// check if no token
	if (!token) {
		return res
			.status(401)
			.json({ message: 'no token, authorization denied' });
	}

	// verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (err) {
		console.log(err);
		res.status(401).json({ message: 'token not valid' });
	}
};
