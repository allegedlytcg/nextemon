require('dotenv').config({ path: require('find-config')('.env') });
const PlayerPerspective = require('../../classes/perspectiveModule')
const Game = require('../../models/Game')


//houses get(in part, because we release perspectives, rather than game config), and set of game config for a given game
//TODO finish getPerspective
async function getStartPerspective(roomId, player) {
	try {
        const gameConfig = await Game.findOne({ roomId });
		console.log("game found for perspective roomid is " + gameConfig.roomId);

	
		return PlayerPerspective.getStartingPerspective(player, gameConfig);

	} catch (error) {
		console.log('error occured: ' + error)
		return error;
	}
}




const getStartPerspectiveFromGame = (roomId,player) => {
	console.log("hit get start perspective from game main call")

	return getStartPerspective(roomId, player);
}



module.exports = { getStartPerspectiveFromGame};
