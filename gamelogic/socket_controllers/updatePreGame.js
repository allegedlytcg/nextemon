require('dotenv').config({ path: require('find-config')('.env') });
const Deck = require('../../models/Deck')
const Pregame = require('../../models/Pregame')

//local get deck by id request
async function updateGameConfig(roomId, player, deckIdPassed){
	try {
		const deck = await Deck.findById(deckIdPassed)
		console.log("deck found is..." + JSON.stringify(deck.name));
		//TODO replace with findOneandUpdate
		let tempPregame = await Pregame.findOne({roomId});
		console.log("temppregame config is " + JSON.stringify(tempPregame) + "while player socket is " + JSON.stringify(player));;
		let indexOfPlayer = 0;
		//get position of the index
		for (let i = 0; i < tempPregame.players.length; i++) {
			if (player === tempPregame.players[i].socketId){
				//found matching socket	
				indexOfPlayer = i;
				break;
			}
			else if(i+1 === tempPregame.players.length){
				console.error("did not find appropriate socket ID for pregame configuration, there is an issue on server side");
			}
		  }
		let body = JSON.parse(JSON.stringify(tempPregame));
		body.players[indexOfPlayer].cards = JSON.parse(JSON.stringify(deck));
		delete body._id;
		console.log("body is now hopefully sent with update here as..." + JSON.stringify(body));
		

		const pregameUpdated = await Pregame.updateOne(
			{ roomId} ,
			{body},
				
		);
		console.log("pregame updated and found is..." + JSON.stringify(pregameUpdated));
		console.log("setting player config and finding out if not empty on pregame record after update");
		// let returnString = "Issue occured during update pregame config";

		return pregameUpdated
		
	} catch (error) {
		return error;
	}
}
async function getPregameByRoomName(roomId){
	try {
		console.log("random findOne returned i s" + JSON.stringify(await Pregame.findOne()))
		const pregame = await Pregame.findOne({roomId})
		console.log("pregame found is..." + JSON.stringify(pregame));
		return pregame
	} catch (error) {
		return error;
	}
}

const updatePreGame =  (roomId, player, deckToFind) => {

	return updateGameConfig(roomId, player, deckToFind);
}

const  getGameConfigByRoomId =  (roomId, player, deckToFind) => {
	return getDeckById(deckToFind);
	//get the pregame config associated to the roomID emitted from socket!
	getGameConfigByRoomId(roomId);
}

module.exports = { updatePreGame };
