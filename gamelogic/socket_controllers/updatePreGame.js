require('dotenv').config({ path: require('find-config')('.env') });
const Deck = require('../../models/Deck')
const Pregame = require('../../models/Pregame')

//local get deck by id request
async function updateGameConfig(roomId, player, deckIdPassed){
	try {
		console.log("ROOMID sent with updategameconfig is " +roomId + " while player si " + player);
		const deck = await Deck.findById(deckIdPassed)
		// console.log("deck found IN UPDATE GAMECONFIG is..." + JSON.stringify(deck.name));
		//TODO replace with findOneandUpdate
		// console.log("roomId PASSED ot find the fucking game config is " + JSON.stringify(roomId));
		const tempPregame = await Pregame.findOne({roomId, "players.socketId": player });
		console.log("temppregame config is " + JSON.stringify(tempPregame) + "while player socket is " + JSON.stringify(player));;
		let isempty = false;
		if(tempPregame.players[0].cards.length >0){
			console.log("splice of player 0 cards is " + JSON.stringify(tempPregame.players[0].cards.slice(-2)))
		}
		else{
			console.log("instead of cards temppregameat player 0 is " + tempPregame.players[0]);
		}
		if(tempPregame.players[1].cards.length >0){
			console.log("splice of player 0 cards is " + JSON.stringify(tempPregame.players[1].cards.slice(-2)))
		}
		else{
			console.log("instead of cards temppregameat player 1 is " + tempPregame.players[1]);
		}
		let indexOfPlayer = 0;
		//get position of the index
		// for (let i = 0; i < tempPregame.players.length; i++) {
		// 	if (player === tempPregame.players[i].socketId){
		// 		//found matching socket	
		// 		indexOfPlayer = i;
		// 		break;
		// 	}
		// 	else if(i+1 === tempPregame.players.length){
		// 		console.error("did not find appropriate socket ID for pregame configuration, there is an issue on server side");
		// 	}
		//   }
		//   console.log("index of player found is" + indexOfPlayer);
		// let body = JSON.parse(JSON.stringify(tempPregame));
		// console.log("deck to stringify maybe is " + JSON.stringify(deck));
		let cardsToUpdate = JSON.parse(JSON.stringify(deck.cards));
	
		let sliceOfcards = cardsToUpdate.slice(-2);
		let indexOfOther = indexOfPlayer===0?1:0;
		// let sliceOfcardsOtherPlayer = body.players[indexOfOther].cards.length >0? body.players[indexOfOther].cards.slice(-2):" No cards found!";

		console.log("body is now hopefully sent with update here as..." + JSON.stringify(sliceOfcards) );
		// console.log("Other player cards also in the body sent for update?" + JSON.stringify(sliceOfcardsOtherPlayer))

		const pregameUpdated = await Pregame.findOneAndUpdate(
			{ roomId, "players.socketId": player },
			{ $set: { "players.$.cards": cardsToUpdate, "coinDecisionSocketId":player}}
			
		);
		
		console.log("pregame updated and found is..." + JSON.stringify(pregameUpdated.roomId));
		console.log("setting player config and finding out if not empty on pregame record after update");
		// let returnString = "Issue occured during update pregame config";
			console.log("pregameupdated result is " + pregameUpdated);
	
		const pregameFetch = await Pregame.findOne({roomId})

			
		//TODO if pregameFetch contains cards for both players (not empty) trigger reqCoinTossDecision event to FE
		

		return pregameFetch;
		
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
