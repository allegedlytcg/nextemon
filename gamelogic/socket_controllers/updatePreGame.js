require('dotenv').config({ path: require('find-config')('.env') });
const { MongoClient } = require('mongodb');
// const Deck = require('../../models/Deck');



//SINCE 'createPreGame' handles auto deletes a previous pregame with the same room name, assumes room control logic is in place to handle pregame obj mishaps
//room id=string players=[]
const updatePreGame = (roomId, player, decktoFind) => {

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
				const updateDeck = getDeckbyId(decktoFind);
				console.log("PERHAPS now we have updateDeck async within async return value " + JSON.stringify(updateDeck))


				// console.debug("room passed TO UPDATE PREGAME is" + JSON.stringify(roomId));
				// let collectionCount = collection.find();
				// let countcount = await collectionCount.count();
				// console.log("ALL PREGAMES IN COLLECTION COUNT IS: " + (countcount));

				// console.debug("if not null exists + " + existing);
				// //use roomId to find the pregame to update, checked by player socket passed
				// const collection = pregameDb.collection('deck');
				// const existing = await collection.findOne({ roomId });
				// const requestedPlayerConfig = existing.player[player];
				// console.debug("requestedPlayerconfig is " + JSON.stringify(requestedPlayerConfig));
				// console.debug("still in update pregame, player deck passed to update is for player: " + player + " and deck to find of id: " + JSON.stringify(decktoFind));
				// // let updateDeck = getDeckbyId(decktoFind);
				// console.log("PERHAPS now we have updateDeck async within async return value" + JSON.stringify(updateDeck))
				// if (requestedPlayerconfig.cards.length > 0) {
				// 	console.error("User has already sent their deck update, there is a synchronicity bug during handshake");
				// 	return { gameStatus: 'PREGAME_UPDATE_FAIL' };
				// }
				// else {
				// 	//update the cards for the requested player
				// 	console.debug("TODO UPDATE DECK HERE");


				// 	//check if both players cards present after update
				// 	// const newexisting = await collection.findOne({ roomId });


				// }
				// if (existing !== null) {
				// 	//TODO DELETE IT and recreate instead eventually

				// 	const delres = collection.deleteOne(existing);
				// 	//if above doesn't work delete using roomId?

				// 	console.log("DELETING PREGAME with roomId: " + roomId + " aleady exists, needs deletion/forced update RESULTED is" + JSON.stringify(delres));
				// 	//now existing should be null
				// 	const newexisting = await collection.findOne({ roomId });
				// 	// console.debug("if null was deleted! + " + newexisting);
				// }
				// else {
				// 	console.log('ROOM NOT CREATED YET')
				// }
				// //else(implied from return statement above)

				// const newPreGame = {
				// 	roomId,
				// 	players: players1,
				// };
				// console.log('log after NEWPREGAME with value of: ' + JSON.stringify(newPreGame));
				// await collection.insertOne(newPreGame);

				// db.close();
			},
		);
		return {
			gameStatus: 'PREGAME_CREATE_SUCCESS',
		};
	} catch (error) {
		return error;
	}
};



//local get deck by id request
const getDeckbyId = (deckIdPassed) => {
	try {

		return MongoClient.connect(
			process.env.MONGO_DB,
			{ useUnifiedTopology: true },
			async (err, db) => {
				if (err) throw err;
				const mainDb = db.db('test');

				const collection = mainDb.collection('decks');
				let collectionCount = collection.find();
				let countcount = await collectionCount.count();
				console.log("ALL decks IN COLLECTION COUNT IS: " + (countcount));

				const existing = await collection.findOne({ id: deckIdPassed });
				console.log("result of local FINDDECK  is" + JSON.stringify(existing));
				if (existing !== null) {
					
					
					console.log(`deck with deckId: ${deckIdPassed} is` + existing);
					return existing;
				}
				else {
					db.close();
					console.error("Couldn't find deck in local get..." + JSON.stringify(existing));
					return null;

				}
				
			}
			
			);

	} catch (error) {
		return error;
	}
 

}

module.exports = { updatePreGame };
