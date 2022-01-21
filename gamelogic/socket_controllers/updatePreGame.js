require('dotenv').config({ path: require('find-config')('.env') });
const Deck = require('../../models/Deck')
const Pregame = require('../../models/Pregame')

//local get deck by id request
async function updateGameConfig(roomId, player, deckIdPassed){
	try {
		const deck = await Deck.findById(deckIdPassed)
		console.log("deck found is..." + JSON.stringify(deck));
		// //TODO replace with findOneandUpdate
		// const pregame = await Pregame.findOne({roomId})
		// console.log("pregame found is..." + JSON.stringify(pregame));
		// console.log("setting player config and finding out if not empty on pregame record after update");
		// let returnString = "Issue occured during update pregame config";
		// // if(pregame.player[0].cards > 0 && pregame.player[1].cards >0){
		// // 	return "Both players are configured" 
		// // }
		// // else{
		// 	return pregame
		// // }
		return deck
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
