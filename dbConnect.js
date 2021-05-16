const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
	try {
		await mongoose.connect(process.env.MONGO_DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}),
			console.log('mongoDB connected....');
	} catch (err) {
		console.log(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = dbConnect;
