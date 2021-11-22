require('dotenv').config({ path: require('find-config')('.env') });
const { MongoClient } = require('mongodb');



//auto deletes a previous pregame with the sam ename, assumes room control logic is in place to handle pregame obj mishaps
//room id=string players=[]
const updatePreGame = ( roomId,  player ) => {
	
	try {
		// let roomId = "hibidee-dibidee";

		// let players1 = 	{"players": [
		// 	{
		// 		"socketId": players[0],
		// 		"cards": []
		// 	},
		// 	{
		// 		"socketId": players[1],
		// 		"cards": []
		// 	}
		// ]
		// };
		MongoClient.connect(
			process.env.MONGO_DB,
			{ useUnifiedTopology: true },
			async (err, db) => {
				if (err) throw err;
				const pregameDb = db.db('test');

				
				let collectionCount = collection.find();
				let countcount = await collectionCount.count();
				console.log("ALL PREGAMES IN COLLECTION COUNT IS: " + (countcount));
				
				console.debug("if not null exists + " +  existing);
				//use roomId to find the pregame to update, checked by player socket passed
				const collection = pregameDb.collection('pregames');
				const existing = await collection.findOne({ roomId });
				const requestedPlayerConfig = existing.player[player];
				console.debug("requestedPlayerconfig is " + JSON.stringify(requestedPlayerConfig));
				if(requestedPlayerconfig.cards.length > 0){
					return{gameStatus: 'PREGAME_UPDATE_FAIL'};
				}
				else{
					//update the cards for the requested player



					//check if both players cards present after update
					const newexisting = await collection.findOne({roomId});
					foreach

				}
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
			gameStatus: 'PREGAME_CREATE_SUCCESS',
		};
	} catch (error) {
		return error;
	}
};

module.exports = { updatePreGame };
