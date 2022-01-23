require('dotenv').config({ path: require('find-config')('.env') });
const Deck = require('../../models/Deck')
const Pregame = require('../../models/Pregame')

//TODO remove creating preGame obj hopefully with sample pregame.json and use args passed instead from server on 2nd socket join of room

//auto deletes a previous pregame with the same room name, assumes room control logic is in place to handle pregame obj mishaps
//room id=string players=[]


// @route     POST api/deck/
// @desc      create deck
// @access    private


const createPreGame = (roomId, players) => {
		console.log("players passed to createPreGAme is " +players);
		return createPreGameAsync(roomId,players);


}

async function createPreGameAsync(roomId, players){
	try {
		console.log("players0 and players 1 respectively are.." + players[0] + " and.." + players[1]);
		let players1 = 	[
			{
				socketId: players[0],
				cards: []
			},
			{
				socketId: players[1],
				cards: []
			}
		]
		;


		const existing = await Pregame.findOne({ roomId });

		//simply deletes existing pregame config to clear for new players on this room
		if (existing !== null) {
			const delres = Pregame.deleteOne(existing);
			//if above doesn't work delete using roomId?
			
			console.log("DELETING PREGAME with roomId:", roomId, "aleady exists, needs deletion/forced update RESULTED is", delres);
			//now existing should be null
			//TODO keep below for testing purposes for now
			// const newexisting = await collection.findOne({roomId});
			// console.debug("Replaced deleted with new pregame config using same name!", newexisting);
		}
		else{
			console.log("did not find existing ")
		}

		let newPreGame = new Pregame({
			roomId,
			players: players1,
		});
		console.log("logging object used to create" + players1)
		const shit = await newPreGame.save();
		const shit2 = await Pregame.findOne({roomId});
		console.log("Logging created pregame config to ensure its created " + shit + " and finding that created record is " + shit2);
		return {gameStatus: 'PREGAME_CREATE_SUCCESS'};
	} catch (error) {
		return error;
	}
}

// const createPreGame = ( roomId,  players ) => {
// 	try {
// 		// let roomId = "hibidee-dibidee";
		
// 		MongoClient.connect(
// 			process.env.MONGO_DB,
// 			{ useUnifiedTopology: true },
// 			async (err, db) => {
// 				if (err) throw err;
// 				const pregameDb = db.db('test');

// 				const collection = pregameDb.collection('pregames');
// 				console.log("room id for create pregame is " + JSON.stringify(roomId));
// 				const existing = await collection.findOne({ roomId });

// 				//simply deletes existing pregame config to clear for new players on this room
// 				if (existing !== null) {
// 					const delres = collection.deleteOne(existing);
// 					//if above doesn't work delete using roomId?
					
// 					// console.log("DELETING PREGAME with roomId:", roomId, "aleady exists, needs deletion/forced update RESULTED is", JSON.stringify(delres));
// 					//now existing should be null
// 					//TODO keep below for testing purposes for now
// 					// const newexisting = await collection.findOne({roomId});
// 					// console.debug("Replaced deleted with new pregame config using same name!", newexisting);
// 				}

// 				const newPreGame = {
// 					roomId,
// 					players: players1,
// 				};

// 				await collection.insertOne(newPreGame);
// 				await collection.findOne({roomId});
// 				console.log("Logging created pregame config to ensure its created" + JSON.stringify(newPreGame));
// 				db.close();
// 			},
// 		);
// 		return {gameStatus: 'PREGAME_CREATE_SUCCESS'};
// 	} catch (error) {
// 		return error;
// 	}
// };

module.exports = { createPreGame };
