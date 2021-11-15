require('dotenv').config({ path: require('find-config')('.env') });
const { MongoClient } = require('mongodb');
const pregameDoc = require('../sample_docs/pregame.json');

//TODO remove creating preGame obj hopefully with sample pregame.json and use args passed instead from server on 2nd socket join of room

const createPreGame = ({ roomId = '', players = [] }) => {
	console.log("alright createPregame started...")
	try {
		let roomId = "hibidee-dibidee";
		console.debug("pregame doc is " + JSON.stringify(pregameDoc) + "and is of type: " + typeof(pregameDoc));
		let players1 = 	{"players": [
			{
				"socketId": "skldjflk",
				"cards": []
			},
			{
				"socketId": "sfsdfsd",
				"cards": []
			}
		]
		};
		MongoClient.connect(
			process.env.MONGO_DB,
			{ useUnifiedTopology: true },
			async (err, db) => {
				if (err) throw err;
				const pregameDb = db.db('test');

				const collection = pregameDb.collection('pregames');
				let collectionCount = collection.find();
				let countcount = await collectionCount.count();
				console.log("ALL PREGAMES IN COLLECTION COUNT IS: " + (countcount));
				const existing = await collection.findOne({ roomId });

				if (existing !== null) {
					//TODO DELETE IT and recreate instead eventually

					const delres = collection.deleteOne(existing);
					//if above doesn't work delete using roomId?
					
					console.log("DELETING PREGAME with roomId: "+ roomId +" aleady exists, needs deletion/forced update RESULTED is" + JSON.stringify(delres));
					//now existing should be null
					const newexisting = await collection.findOne({roomId});
					console.debug("if null was deleted! + " +  newexisting);
				}
				else{
					console.log('ROOM NOT CREATED YET')
				}
				//else(implied from return statement above)

				const newPreGame = {
					roomId,
					players: players1,
				};
				console.log('log after NEWPREGAME with value of: '+ JSON.stringify(newPreGame));
				await collection.insertOne(newPreGame);

				db.close();
			},
		);
		return {
			gameStatus: 'created PREGAME',
		};
	} catch (error) {
		return error;
	}
};

module.exports = { createPreGame };
