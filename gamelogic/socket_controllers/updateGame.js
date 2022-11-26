require('dotenv').config({ path: require('find-config')('.env') });
const PlayerPerspective = require('../../classes/perspectiveModule')
const Game = require('../../models/Game')
const RequestStructure = require('../../models/RequestStructure');


//houses get(in part, because we release perspectives, rather than game config), and set of game config for a given game
//TODO finish getPerspective
async function getStartPerspective(roomId, player) {
	try {
        const gameConfig = await Game.findOne({ roomId });
		console.log("game found for perspective roomid is " + gameConfig.roomId + " player is: " + player);

	
		return PlayerPerspective.getCurrentPerspectiveForGamePlayer(player, gameConfig);

	} catch (error) {
		console.log('error occured: ' + error)
		return error;
	}
}

//fires off a rejection/processing of the request from a player from getChangeRequestDecisionForGamePlayer
async function getChangeRequestDecision(roomId, player, requestStructure) {
	//get previous game config still
	try {
        const gameConfig = await Game.findOne({ roomId });
		console.log("game found for perspective roomid is " + gameConfig.roomId);
		return PlayerPerspective.getChangeRequestDecisionForGamePlayer(player, gameConfig, requestStructure);
		
	} catch (error) {
		console.log('error occured: ' + error)
		return error;
	}
}




const getStartPerspectiveRootCall = (roomId,player) => {
	console.log("hit get start perspective from game main call")

	return getStartPerspective(roomId, player);
}

//data.requestFromPlayer holds the player decision to authorize under conditions
const getChangeRequestDecisionRootCall = (roomId,player, requestFromPlayer) => {
	console.log("request from player is " + JSON.stringify(requestFromPlayer))
	console.log("hit UPDATE perspective from a player action request of request structure " + JSON.stringify(requestFromPlayer))


	return getChangeRequestDecision(roomId, player, requestFromPlayer);
}



module.exports = { getStartPerspectiveRootCall, getChangeRequestDecisionRootCall};
