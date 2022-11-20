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
async function getUpdatedPerspective(roomId, player) {
	//get previous game config still
	try {
        const gameConfig = await Game.findOne({ roomId });
		console.log("game found for perspective roomid is " + gameConfig.roomId);

	
		return PlayerPerspective.getUpdatedPerspectiveForGamePlayer(player, gameConfig);

	} catch (error) {
		console.log('error occured: ' + error)
		return error;
	}
}




const getStartPerspectiveRootCall = (roomId,player) => {
	console.log("hit get start perspective from game main call")

	return getStartPerspective(roomId, player);
}

const getUpdatedPerspectiveRootCall = (roomId,player, data) => {
	console.log("request from player is " + JSON.stringify(data.requestFromPlayer))
	const requestStructure = new RequestStructure(data.requestFromPlayer);
	console.log("hit UPDATE perspective from a player action request of request structure " + JSON.stringify(requestStructure))


	return getUpdatedPerspective(roomId, player);
}



module.exports = { getStartPerspectiveRootCall, getUpdatedPerspectiveRootCall};
