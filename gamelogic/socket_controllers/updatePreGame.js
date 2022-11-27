require('dotenv').config({ path: require('find-config')('.env') });
const PlayerPerspective = require('../../classes/perspectiveModule')
const Deck = require('../../models/Deck')
const Pregame = require('../../models/Pregame')
const Game = require('../../models/Game')
const { flipCoin } = require('../common');
const { shuffleDeck } = require('../common');
const RequestStructure = require("../../models/RequestStructure");
const { getCurrentPerspectiveForGamePlayer } = require('../../classes/perspectiveModule');


//each player updates pregame config with their chosen deck
async function updateGameConfig(roomId, player, deckIdPassed) {
	try {
		console.log("ROOMID sent with updategameconfig is " + roomId + " while player si " + player);
		const deck = await Deck.findById(deckIdPassed)
		// console.log("deck found IN UPDATE GAMECONFIG is..." + JSON.stringify(deck.name));
		//TODO replace with findOneandUpdate
		// console.log("roomId PASSED ot find the fucking game config is " + JSON.stringify(roomId));
		const tempPregame = await Pregame.findOne({ roomId, "players.socketId": player });
		console.log("temppregame config is " + JSON.stringify(tempPregame) + "while player socket is " + JSON.stringify(player));;
		let isempty = false;
		if (tempPregame.players[0].cards.length > 0) {
			console.log("splice of player 0 cards is " + JSON.stringify(tempPregame.players[0].cards.slice(-2)))
		}
		else {
			console.log("instead of cards temppregameat player 0 is " + tempPregame.players[0]);
		}
		if (tempPregame.players[1].cards.length > 0) {
			console.log("splice of player 0 cards is " + JSON.stringify(tempPregame.players[1].cards.slice(-2)))
		}
		else {
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
		let indexOfOther = indexOfPlayer === 0 ? 1 : 0;
		// let sliceOfcardsOtherPlayer = body.players[indexOfOther].cards.length >0? body.players[indexOfOther].cards.slice(-2):" No cards found!";

		console.log("body is now hopefully sent with update here as..." + JSON.stringify(sliceOfcards));
		// console.log("Other player cards also in the body sent for update?" + JSON.stringify(sliceOfcardsOtherPlayer))

		const pregameUpdated = await Pregame.findOneAndUpdate(
			{ roomId, "players.socketId": player },
			{ $set: { "players.$.cards": cardsToUpdate, "coinDecisionSocketId": player } },
			{ returnOriginal: false }

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

async function getPregameByRoomName(roomId) {
	try {
		console.log("random findOne returned i s" + JSON.stringify(await Pregame.findOne()))
		const pregame = await Pregame.findOne({ roomId })
		console.log("pregame found is..." + JSON.stringify(pregame));
		return pregame
	} catch (error) {
		return error;
	}
}
//critical step, not only provides coin result, but new actual game config db presence since we have everything needed to start the game!
//occurs after update game config, and player emits their decision for coin result guess 
//execute coin toss and update the coindecision socketid to the winning socket
async function updateGameConfigCoinResult(roomId, player, playerCoinDecision) {
	try {
		console.log("ROOMID sent with updategameconfig FOR COIN DECISION is " + roomId + " while player si " + player);

		// console.log("deck found IN UPDATE GAMECONFIG is..." + JSON.stringify(deck.name));
		//TODO replace with findOneandUpdate
		// console.log("roomId PASSED ot find the fucking game config is " + JSON.stringify(roomId));
		const tempPregame = await Pregame.findOne({ roomId, "players.socketId": player });
		console.log("temppregamE CONFIG previous socket assigned for coin decision was " + JSON.stringify(tempPregame.coinDecisionSocketId) + "while player socket is " + JSON.stringify(player) + "player coin decision WAS" + playerCoinDecision);;
		//winningplayer will be re-assigned according to result
		const coinFlipResult = flipCoin().toUpperCase();
		let winningPlayer = player;
		console.log('flip coin result is ' + coinFlipResult + ' while playerCo9inDecision was ' + playerCoinDecision);
		if (!(coinFlipResult === playerCoinDecision)) {

			console.log("both players must be present here player1: '" + tempPregame.players[0].socketId + "'  player2: '" + tempPregame.players[1].socketId + "'");
			const playerFound =
				winningPlayer = tempPregame.players.find(aplayer => aplayer.socketId !== player).socketId
			// for (let i = 0; i < tempPregame.players.length; i++) {
			// 	if (tempPregame.players[i].socketId !== player) {
			// 		winningPlayer = tempPregame.players[i].socketId;
			// 		console.log("found other socket to be the winner this time proposed coin choice of deciding player was WRONG");
			// 		break;
			// 	}
			// 	else {
			// 		console.log('loop is continuing ' + JSON.stringify(tempPregame.players[i].socketId + ' while player that decided should be same here ' + JSON.stringify(player)))
			// 	}
			// }

		}
		else {
			console.log('proposed coin choice of deciding player was CORRECT')
		}
		console.log("WINNING PLAYER FINALLY SOCKET SHOULD BE HERE " + JSON.stringify(winningPlayer))
		//execute 'coin toss' util and decide assign winning player to the new socket, emit to both players the result





		// we use the same field 'coinDecisionSocketId' for gameConfig to update who decides first 
		const pregameUpdated = await Pregame.findOneAndUpdate(
			{ roomId, "players.socketId": player },
			{ $set: { "coinDecisionSocketId": winningPlayer } },
			{ returnOriginal: false }

		);
		// console.log('pregameUpdated from finoneandupdate is ' + JSON.stringify(pregameUpdated));

		const updatedPregame = await Pregame.findOne({ roomId });
		console.log("updatedPregame to work from and is now showing winner socketid of " + JSON.stringify(updatedPregame.coinDecisionSocketId));
		//see if existing, if so delete!
		const delres = await Game.findOneAndDelete({ roomId });
		//simply deletes existing pregame config to clear for new players on this room
		if (delres !== null) {
			//if above doesn't work delete using roomId?

			console.log("Result of game deletion query with roomId:", roomId, " is...", delres);

		}
		else {
			console.log("did not find existing game ")
		}

		const isPlayer1Winner = updatedPregame.players[0].socketId === winningPlayer;
		//for each card we have to modify base properties we have added to track status of card during game, such as isBench, isActive etc


		const newGame = new Game({
			roomId,
			players: [{ socketId: updatedPregame.players[0].socketId, turn: isPlayer1Winner, energyAttachedThisTurn: false, cards: updatedPregame.players[0].cards },
			{ socketId: updatedPregame.players[1].socketId, turn: !isPlayer1Winner, energyAttachedThisTurn: false, cards: updatedPregame.players[1].cards },

			]
		});

		await newGame.save();
		const shit2 = await Game.findOne({ roomId });
		console.log(" Newly created game record is " + shit2.roomId +
			'maybe player here hopefully... ' + JSON.stringify(shit2.players[0].socketId) + 'is it player 1 turn? ');
		const tempGame = JSON.parse(JSON.stringify(shit2));
		console.log('my kingdom for a card player 1  ' + JSON.stringify(tempGame.players[0].cards[0].name))
		console.log('my kingdom for a card player 2  ' + JSON.stringify(tempGame.players[1].cards[0].name))

		//update deck's via shuffle and assignment of first 7 of shuffled to 'inhand' for both players

		let shuffledPlayer1Deck = shuffleDeck(tempGame.players[0].cards);
		//assign hand for each player


		let shuffledPlayer2Deck = shuffleDeck(tempGame.players[1].cards);

		for (let i = 0; i < 7; i++) {
			shuffledPlayer2Deck[i].isHand = true;
			shuffledPlayer2Deck[i].isInDeck = false;
			shuffledPlayer1Deck[i].isHand = true;
			shuffledPlayer1Deck[i].isInDeck = false;

		}
		//TODO remove these lines for test purposes only on front end for config, chosen index sequential for
		//testing purposes, where we have a bench with 2 pokemon, an active, and cards attached for both players
		shuffledPlayer2Deck[8].isDiscarded = true;
		shuffledPlayer2Deck[8].isInDeck = false;
		shuffledPlayer1Deck[8].isDiscarded = true;
		shuffledPlayer1Deck[8].isInDeck = false;

		//fill active position with 8 attached
		shuffledPlayer2Deck[9].isActive = true;
		shuffledPlayer2Deck[9].isInDeck = false;
		shuffledPlayer1Deck[9].isActive = true;
		shuffledPlayer1Deck[9].isInDeck = false;

		shuffledPlayer2Deck[18].attachedAsEnergy = 0;
		shuffledPlayer2Deck[18].isInDeck = false;
		shuffledPlayer1Deck[18].attachedAsEnergy = 0;
		shuffledPlayer1Deck[18].isInDeck = false;

		shuffledPlayer2Deck[19].attachedAsEnergy = 0;
		shuffledPlayer2Deck[19].isInDeck = false;
		shuffledPlayer1Deck[19].attachedAsEnergy = 0;
		shuffledPlayer1Deck[19].isInDeck = false;

		shuffledPlayer2Deck[20].attachedAsEnergy = 0;
		shuffledPlayer2Deck[20].isInDeck = false;
		shuffledPlayer1Deck[20].attachedAsEnergy = 0;
		shuffledPlayer1Deck[20].isInDeck = false;

		shuffledPlayer2Deck[21].attachedAsEnergy = 0;
		shuffledPlayer2Deck[21].isInDeck = false;
		shuffledPlayer1Deck[21].attachedAsEnergy = 0;
		shuffledPlayer1Deck[21].isInDeck = false;

		shuffledPlayer2Deck[22].attachedAsEnergy = 0;
		shuffledPlayer2Deck[22].isInDeck = false;
		shuffledPlayer1Deck[22].attachedAsEnergy = 0;
		shuffledPlayer1Deck[22].isInDeck = false;

		shuffledPlayer2Deck[23].attachedAsEnergy = 0;
		shuffledPlayer2Deck[23].isInDeck = false;
		shuffledPlayer1Deck[23].attachedAsEnergy = 0;
		shuffledPlayer1Deck[23].isInDeck = false;

		shuffledPlayer2Deck[24].attachedAsEnergy = 0;
		shuffledPlayer2Deck[24].isInDeck = false;
		shuffledPlayer1Deck[24].attachedAsEnergy = 0;
		shuffledPlayer1Deck[24].isInDeck = false;

		shuffledPlayer2Deck[25].attachedAsEnergy = 0;
		shuffledPlayer2Deck[25].isInDeck = false;
		shuffledPlayer1Deck[25].attachedAsEnergy = 0;
		shuffledPlayer1Deck[25].isInDeck = false;

		//fill the bench with 7 attached on 1st, 5 on 2nd for threshold test
		shuffledPlayer2Deck[10].isBench = true;
		shuffledPlayer2Deck[10].benchPos = 1;
		shuffledPlayer2Deck[10].isInDeck = false;
		shuffledPlayer1Deck[10].isBench = true;
		shuffledPlayer1Deck[10].benchPos = 1;
		shuffledPlayer1Deck[10].isInDeck = false;




		shuffledPlayer2Deck[11].attachedAsEnergy = 1;
		shuffledPlayer2Deck[11].isInDeck = false;
		shuffledPlayer1Deck[11].attachedAsEnergy = 1;
		shuffledPlayer1Deck[11].isInDeck = false;


		shuffledPlayer2Deck[12].attachedAsEnergy = 1;
		shuffledPlayer2Deck[12].isInDeck = false;
		shuffledPlayer1Deck[12].attachedAsEnergy = 1;
		shuffledPlayer1Deck[12].isInDeck = false;

		shuffledPlayer2Deck[13].attachedAsEnergy = 1;
		shuffledPlayer2Deck[13].isInDeck = false;
		shuffledPlayer1Deck[13].attachedAsEnergy = 1;
		shuffledPlayer1Deck[13].isInDeck = false;

		shuffledPlayer2Deck[14].attachedAsEnergy = 1;
		shuffledPlayer2Deck[14].isInDeck = false;
		shuffledPlayer1Deck[14].attachedAsEnergy = 1;
		shuffledPlayer1Deck[14].isInDeck = false;

		shuffledPlayer2Deck[15].attachedAsEnergy = 1;
		shuffledPlayer2Deck[15].isInDeck = false;
		shuffledPlayer1Deck[15].attachedAsEnergy = 1;
		shuffledPlayer1Deck[15].isInDeck = false;

		shuffledPlayer2Deck[16].attachedAsEnergy = 1;
		shuffledPlayer2Deck[16].isInDeck = false;
		shuffledPlayer1Deck[16].attachedAsEnergy = 1;
		shuffledPlayer1Deck[16].isInDeck = false;

		shuffledPlayer2Deck[17].attachedAsEnergy = 1;
		shuffledPlayer2Deck[17].isInDeck = false;
		shuffledPlayer1Deck[17].attachedAsEnergy = 1;
		shuffledPlayer1Deck[17].isInDeck = false;

		//bench 1 done

		//bench 2
		shuffledPlayer2Deck[26].isBench = true;
		shuffledPlayer2Deck[26].benchPos = 2;
		shuffledPlayer2Deck[26].isInDeck = false;
		shuffledPlayer1Deck[26].isBench = true;
		shuffledPlayer1Deck[26].benchPos = 2;
		shuffledPlayer1Deck[26].isInDeck = false;




		shuffledPlayer2Deck[27].attachedAsEvo = 2;
		shuffledPlayer2Deck[27].isInDeck = false;
		shuffledPlayer1Deck[27].attachedAsEvo = 2;
		shuffledPlayer1Deck[27].isInDeck = false;

		shuffledPlayer2Deck[28].attachedAsEnergy = 2;
		shuffledPlayer2Deck[28].isInDeck = false;
		shuffledPlayer1Deck[28].attachedAsEnergy = 2;
		shuffledPlayer1Deck[28].isInDeck = false;

		//bench 3
		shuffledPlayer2Deck[35].isBench = true;
		shuffledPlayer2Deck[35].benchPos = 3;
		shuffledPlayer2Deck[35].isInDeck = false;
		shuffledPlayer1Deck[35].isBench = true;
		shuffledPlayer1Deck[35].benchPos = 3;
		shuffledPlayer1Deck[35].isInDeck = false;




		shuffledPlayer2Deck[36].attachedAsEnergy = 3;
		shuffledPlayer2Deck[36].isInDeck = false;
		shuffledPlayer1Deck[36].attachedAsEvo = 3;
		shuffledPlayer1Deck[36].isInDeck = false;

		shuffledPlayer2Deck[37].attachedAsEnergy = 3;
		shuffledPlayer2Deck[37].isInDeck = false;
		shuffledPlayer1Deck[37].attachedAsEnergy = 3;
		shuffledPlayer1Deck[37].isInDeck = false;

		//bench 4
		shuffledPlayer2Deck[38].isBench = true;
		shuffledPlayer2Deck[38].benchPos = 4;
		shuffledPlayer2Deck[38].isInDeck = false;
		shuffledPlayer1Deck[38].isBench = true;
		shuffledPlayer1Deck[38].benchPos = 4;
		shuffledPlayer1Deck[38].isInDeck = false;




		shuffledPlayer2Deck[39].attachedAsEvo = 4;
		shuffledPlayer2Deck[39].isInDeck = false;
		shuffledPlayer1Deck[39].attachedAsEvo = 4;
		shuffledPlayer1Deck[39].isInDeck = false;

		shuffledPlayer2Deck[40].attachedAsEnergy = 4;
		shuffledPlayer2Deck[40].isInDeck = false;
		shuffledPlayer1Deck[40].attachedAsEnergy = 4;
		shuffledPlayer1Deck[40].isInDeck = false;
		//bench 5
		shuffledPlayer2Deck[41].isBench = true;
		shuffledPlayer2Deck[41].benchPos = 5;
		shuffledPlayer2Deck[41].isInDeck = false;
		shuffledPlayer1Deck[41].isBench = true;
		shuffledPlayer1Deck[41].benchPos = 5;
		shuffledPlayer1Deck[41].isInDeck = false;




		shuffledPlayer2Deck[42].attachedAsEvo = 5;
		shuffledPlayer2Deck[42].isInDeck = false;
		shuffledPlayer1Deck[42].attachedAsEvo = 5;
		shuffledPlayer1Deck[42].isInDeck = false;

		shuffledPlayer2Deck[43].attachedAsEnergy = 5;
		shuffledPlayer2Deck[43].isInDeck = false;
		shuffledPlayer1Deck[43].attachedAsEnergy = 5;
		shuffledPlayer1Deck[43].isInDeck = false;







		//sample prizes for count 6 each
		shuffledPlayer2Deck[29].isPrizeCard = true;
		shuffledPlayer2Deck[29].isInDeck = false;
		shuffledPlayer1Deck[29].isPrizeCard = true;
		shuffledPlayer1Deck[29].isInDeck = false;
		shuffledPlayer2Deck[30].isPrizeCard = true;
		shuffledPlayer2Deck[30].isInDeck = false;
		shuffledPlayer1Deck[30].isPrizeCard = true;
		shuffledPlayer1Deck[30].isInDeck = false;
		shuffledPlayer2Deck[31].isPrizeCard = true;
		shuffledPlayer2Deck[31].isInDeck = false;
		shuffledPlayer1Deck[31].isPrizeCard = true;
		shuffledPlayer1Deck[31].isInDeck = false;
		shuffledPlayer2Deck[32].isPrizeCard = true;
		shuffledPlayer2Deck[32].isInDeck = false;
		shuffledPlayer1Deck[32].isPrizeCard = true;
		shuffledPlayer1Deck[32].isInDeck = false;
		shuffledPlayer2Deck[33].isPrizeCard = true;
		shuffledPlayer2Deck[33].isInDeck = false;
		shuffledPlayer1Deck[33].isPrizeCard = true;
		shuffledPlayer1Deck[33].isInDeck = false;
		shuffledPlayer2Deck[34].isPrizeCard = true;
		shuffledPlayer2Deck[34].isInDeck = false;
		shuffledPlayer1Deck[34].isPrizeCard = true;
		shuffledPlayer1Deck[34].isInDeck = false;

		//TODO remove these lines(end)


		// let tempCardsPlayer2 = tempGame.players[1].cards.shuffle();

		const shuffledGame1 = await Game.findOneAndUpdate({ roomId, "players.socketId": tempGame.players[0].socketId },
			{ $set: { "players.$.cards": shuffledPlayer1Deck } },
			{ returnOriginal: false }
		);
		const shuffledGame2 = await Game.findOneAndUpdate({ roomId, "players.socketId": tempGame.players[1].socketId },
			{ $set: { "players.$.cards": shuffledPlayer2Deck } },
			{ returnOriginal: false }
		);

		console.log("my kingdom for the same shuffled card player 1 after update " + JSON.stringify(shuffledGame1.players[0].cards[0].name))
		console.log("my kingdom for the same shuffled card player 2 after update " + JSON.stringify(shuffledGame2.players[1].cards[0].name))
		//TODO REMOVE THIS: we move this for gameStart method emmited from each player to get their perspective, just here as POC for now
		// perspective.getPerspective(shuffledGame2.players[0].socketId, shuffledGame2);




		return updatedPregame;

	} catch (error) {
		return error;
	}
}
// provides update to game config, waits for it, and returns the new game config hopefully or we're in trouble
// "You 'bout to witness hip-hop in its most purest
// Most rawest form, flow almost flawless" -Marshall Mathers
async function updateGameConfigGeneral(roomId, player, reqStructureConfirmed) {
	try {
		console.log("ROOMID sent with updategameconfig FOR UPDATE GAME CONFIG is "
			+ roomId + " while player si " + player + "request structure as: \n" + JSON.stringify(reqStructureConfirmed));





		//update deck's via shuffle and assignment of first 7 of shuffled to 'inhand' for both players

		//todo determine update strategy based on confirmed request type passed in and src/destination details
		//for example energy request involves 2 stacks, update request structure as needed to accomodate
		// FOR ALL REQUEST TYPES AND CHANGES HERE!
		let newPerspective = await modifyGameConfig(player, reqStructureConfirmed, roomId);
		return newPerspective;


	} catch (error) {
		console.log('error in updateGameConfigGeneral is ' + JSON.stringify(error))
		return error;
	}
}


//PREVIOUS method confirms action allowance based on gameConfig, this applies the game config change itself and returns new perspective for requesting player
const modifyGameConfig = async (player, reqStructureConfirmed, roomId) => {
	//BASED ON REQ STRUCTURE MODIFY THE GAME AND APPLY UPDATE
	const curGameConfig = await Game.findOne({ roomId });
	const tempGame = JSON.parse(JSON.stringify(curGameConfig));
	console.log("REQUEST STRUCTURE ON MOD GAME CONFIG IS " + JSON.stringify(reqStructureConfirmed))
	console.log("REQUEST STRUCTURE constant logging is " + JSON.stringify(reqStructureConfirmed.ENERGY_ATTACH))
	console.log("UPDATE player PASSED logging is " + JSON.stringify(player))
	console.log("gameConfig players available are " + JSON.stringify(tempGame.players[0].socketId) + " and other player is " + JSON.stringify(tempGame.players[1].socketId))
	// const playerIndex = tempGame.players[0].socketId === player ? 0 : 1; //for update this players cards only energy attach
	let errorFlag = false
	let tempCards;
	switch (reqStructureConfirmed.CATEGORY) {
		case (reqStructureConfirmed.ENERGY_ATTACH):
			console.log('energy attach game config change issued');

			//get the index of the card we need to move with respect to all cards of player in GameConfig(energy card in this case)
			//as a human we grab the cards that are in hand, and the src card index relative to that so...
			//start index of isHand cards

			tempCards = tempGame.players.filter((givenPlayer) => {
				return givenPlayer.socketId === player
			})[0].cards;
			
			console.log('temp cards of player here hopefully ' + JSON.stringify(tempCards));
			console.log('reqStructure selected index is ' + reqStructureConfirmed.REQ_INFO.slctdSrcCardIndex);
			let indexOfFirstOccurence = -1;
			let totalCardsInHand = tempCards.filter((card)=>{return card.isHand}).length;
			console.log('total cards in hand are ' + totalCardsInHand)
			for (let i = 0; i < tempCards.length; i++) {
				if (tempCards[i].isHand) {
					indexOfFirstOccurence = i;
					break;
				}
			}
			if (indexOfFirstOccurence >= 0) {
				console.log('index of first occurence of ishand hopefuly is ' + JSON.stringify(indexOfFirstOccurence))
				//since ui cards appear in reverse, we need the total length
				const overallIndexOfCardFromSourceStack = indexOfFirstOccurence + totalCardsInHand - 1 - reqStructureConfirmed.REQ_INFO.slctdSrcCardIndex;
				// let indexInCards = tempCards.indexOf(tempCards.filter((card) => {
				console.log('overall index relative to gameConfig is ' + JSON.stringify(overallIndexOfCardFromSourceStack));
				console.log('hopefully original card we need to edit now is here' + JSON.stringify(tempCards[overallIndexOfCardFromSourceStack]));
				tempCards[overallIndexOfCardFromSourceStack].isHand = false



				//tempCards[overallIndexOfCardFromSourceStack] modify for new stack now that its remove via tempCards
				switch (reqStructureConfirmed.REQ_INFO.destStack) {
					case (reqStructureConfirmed.ACTIVE):
						console.log("confirmed active 'ENERGY ATTACH'")
						tempCards[overallIndexOfCardFromSourceStack].attachedAsEnergy = 0;
						break;
					case (reqStructureConfirmed.BENCH1):
						console.log("confirmed bench 1 'ENERGY ATTACH'")
						tempCards[overallIndexOfCardFromSourceStack].attachedAsEnergy = 1;


						break;
					case (reqStructureConfirmed.BENCH2):
						console.log("confirmed bench 2 'ENERGY ATTACH'")
						tempCards[overallIndexOfCardFromSourceStack].attachedAsEnergy = 2;
						break;
					case (reqStructureConfirmed.BENCH3):
						console.log("confirmed bench 3 'ENERGY ATTACH'")
						tempCards[overallIndexOfCardFromSourceStack].attachedAsEnergy = 3;
						break;
					case (reqStructureConfirmed.BENCH4):
						console.log("confirmed bench 4 'ENERGY ATTACH'")
						tempCards[overallIndexOfCardFromSourceStack].attachedAsEnergy = 4;
						break;
					case (reqStructureConfirmed.BENCH5):
						console.log("confirmed bench 5 'ENERGY_ATTACH'")
						tempCards[overallIndexOfCardFromSourceStack].attachedAsEnergy = 5;
						break;
					default:
						console.error("UNEXPECTED CONDITION FOR DESTINATION ON 'ENERGY ATTACH' MUST HANDLE THIS")
						break;

				}


				break;
			}
			else {
				errorFlag = true;
				console.error('error that must be handled/debugged in finding index of first occurence used for perspective filters')
				break;
			}

		case (reqStructureConfirmed.TRAINER_ACTIVATE):
			console.log('hit TRAINER ACTIVATE request')

			break;
		case (reqStructureConfirmed.RETREAT_ORDER):
			console.log('hit RETREAT ORDER request')

			break;
		case (reqStructureConfirmed.EVOLVE_ORDER):
			console.log('hit EVOLVE ORDER request')

			break;
		case (reqStructureConfirmed.ATTACK_ORDER):
			console.log('hit ATTACK ORDER request')

			break;
		case (reqStructureConfirmed.POKE_POWER):
			console.log('hit ENERGY ATTACH request')

			break;
		default:
			console.error('MUST FIX ERROR FOR UPDATE REQ STRUCTURE CASE NOT FOUND')
			break;

	}

	//update game with energy status changes for request
	if (errorFlag) {
		console.error('error occured at some point when attempting to confirm updatedGame')
	}
	else {
	// 	const shuffledGame1 = await Game.findOneAndUpdate({ roomId, "players.socketId": tempGame.players[0].socketId },
	// 	{ $set: { "players.$.cards": shuffledPlayer1Deck } },
	// 	{ returnOriginal: false }
	// );
		try{
			const updatedGame = await Game.findOneAndUpdate({ roomId, "players.socketId": player },
			{ $set: 
				{ "players.$.cards": tempCards, 
				"players.$.energyAttachedThisTurn": true }
			 },
			{ returnOriginal: false }
		);
			//, 
		console.log('this game even updated? ' + JSON.stringify(updatedGame))
		}
		catch(error){
			console.log('error during update at db interface step' + error);
		}

	}


	//wait for shit to update
	const shit2 = await Game.findOne({ roomId });
	const newPerspective = getCurrentPerspectiveForGamePlayer(player, shit2);
	return newPerspective;
}

const updatePreGame = (roomId, player, deckToFind) => {

	return updateGameConfig(roomId, player, deckToFind);
}
const updatePreGameCoinResult = (roomId, player, playerCoinDecision) => {

	return updateGameConfigCoinResult(roomId, player, playerCoinDecision);
}

const updateGameConfigGeneralRoot = (roomId, player, reqStructureConfirmed) => {
	return updateGameConfigGeneral(roomId, player, reqStructureConfirmed)
}


const getGameConfigByRoomId = (roomId, player, deckToFind) => {
	return getDeckById(deckToFind);
	//get the pregame config associated to the roomID emitted from socket!
	getGameConfigByRoomId(roomId);
}

module.exports = { updatePreGame, updatePreGameCoinResult, updateGameConfigGeneralRoot };
