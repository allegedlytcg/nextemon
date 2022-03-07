require('dotenv').config({ path: require('find-config')('.env') });
const Deck = require('../../models/Deck')
const Pregame = require('../../models/Pregame')
const Game = require('../../models/Game')
const { flipCoin} = require('../common');

//each player updates pregame config with their chosen deck
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
			{ $set: { "players.$.cards": cardsToUpdate, "coinDecisionSocketId":player}},
			{returnOriginal: false}
			
		);
		
		console.log("pregame updated and found is..." + JSON.stringify(pregameUpdated.roomId));
		console.log("setting player config and finding out if not empty on pregame record after update");
		// let returnString = "Issue occured during update pregame config";
	
		// const pregameFetch = await Pregame.findOne({roomId})

		console.log("pregameupdated fetch result is " + pregameUpdated);

		//TODO if pregameFetch contains cards for both players (not empty) trigger reqCoinTossDecision event to FE
		

		return pregameUpdated;
		
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
//critical step, not only provides coin result, but new actual game config db presence since we have everything needed to start the game!
//occurs after update game config, and player emits their decision for coin result guess 
//execute coin toss and update the coindecision socketid to the winning socket
async function updateGameConfigCoinResult(roomId, player, playerCoinDecision){
	try {
		console.log("ROOMID sent with updategameconfig FOR COIN DECISION is " +roomId + " while player si " + player);
		
		// console.log("deck found IN UPDATE GAMECONFIG is..." + JSON.stringify(deck.name));
		//TODO replace with findOneandUpdate
		// console.log("roomId PASSED ot find the fucking game config is " + JSON.stringify(roomId));
		const tempPregame = await Pregame.findOne({roomId, "players.socketId": player });
		console.log("temppregamE CONFIG previous socket assigned for coin decision was " + JSON.stringify(tempPregame.coinDecisionSocketId) + "while player socket is " + JSON.stringify(player) + "player coin decision WAS" + playerCoinDecision);;
		//winningplayer will be re-assigned according to result
		let coinFlipResult = flipCoin().toUpperCase();
		let winningPlayer = player;
		console.log('flip coin result is ' + coinFlipResult + ' while playerCo9inDecision was ' + playerCoinDecision);
		if(!(coinFlipResult === playerCoinDecision)){
			for(let i=0;i<tempPregame.players.length; i++){
				if(tempPregame.players[i].socketId !== player){
					winningPlayer = tempPregame.players[i].socketId;
					console.log("found other socket to be the winner this time proposed coin choice of deciding player was WRONG");
					break;
				}
				else{
					console.log('loop is continuing ' + JSON.stringify(tempPregame.players[i].socketId + ' while player that decided should be same here ' + JSON.stringify(player)))
				}
			}
		
		}
		else{
			console.log('proposed coin choice of deciding player was CORRECT')
		}
		console.log("WINNING PLAYER FINALLY SOCKET SHOULD BE HERE "+ JSON.stringify(winningPlayer))
		//execute 'coin toss' util and decide assign winning player to the new socket, emit to both players the result





		// we use the same field 'coinDecisionSocketId' for gameConfig to update who decides first 
		const pregameUpdated = await Pregame.findOneAndUpdate(
			{ roomId, "players.socketId": player },
			{ $set: { "coinDecisionSocketId":winningPlayer}},
			{returnOriginal: false}
			
		);

		let updatedPregame = await Pregame.findOne({roomId});
		console.log("updatedPregame to work from and is now showing winner socketid of " + JSON.stringify(updatedPregame.coinDecisionSocketId));
		//see if existing, if so delete!
		let delres = await Game.findOneAndDelete({roomId});
		//simply deletes existing pregame config to clear for new players on this room
		if (delres !== null) {
			//if above doesn't work delete using roomId?
			
			console.log("Result of game deletion query with roomId:", roomId, " is..." , delres);

		}
		else{
			console.log("did not find existing game ")
		}
		console.log('attempting to log socket + single card from a player ' + JSON.stringify(updatedPregame.players[0].socketId) + 
		'card of that player is ' + JSON.stringify(updatedPregame.players[0].cards[0]))
		let isPlayer1Winner = updatedPregame.players[0].socketId === winningPlayer;
		//for each card we have to modify base properties we have added to track status of card during game, such as isBench, isActive etc
	

		let newGame = new Game({
			roomId,
			players: [{socketId: updatedPregame.players[0].socketId, turn: isPlayer1Winner, cards:updatedPregame.players[0].cards},
					{socketId: updatedPregame.players[1].socketId, turn: !isPlayer1Winner, cards:updatedPregame.players[1].cards},
		
				]
		});
		
		const shit = await newGame.save();
		const shit2 = await Game.findOne({roomId});
		console.log("Logging created pregame config to ensure its created " + shit.roomId + " and finding that created record is " + shit2.roomId + 
		'maybe player here hopefully... ' + JSON.stringify(shit2.players[0].socketId) + 'is it player 1 turn? ' + shit2.players[0].turn + ' how about player 2? '
		+ JSON.stringify(shit2.players[1].turn));
		console.log("my kingdom for a card " + JSON.stringify(shit2.players[0].cards[0].isActive))


		return pregameUpdated;
		
	} catch (error) {
		return error;
	}
}

const updatePreGame =  (roomId, player, deckToFind) => {

	return updateGameConfig(roomId, player, deckToFind);
}
const updatePreGameCoinResult =  (roomId, player, playerCoinDecision) => {

	return updateGameConfigCoinResult(roomId, player, playerCoinDecision);
}



const  getGameConfigByRoomId =  (roomId, player, deckToFind) => {
	return getDeckById(deckToFind);
	//get the pregame config associated to the roomID emitted from socket!
	getGameConfigByRoomId(roomId);
}

module.exports = { updatePreGame, updatePreGameCoinResult };
