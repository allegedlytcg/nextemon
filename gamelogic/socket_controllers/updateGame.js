require('dotenv').config({ path: require('find-config')('.env') });
const PlayerPerspective = require('../../classes/perspectiveModule')
const Game = require('../../models/Game')


//houses get(in part, because we release perspectives, rather than game config), and set of game config for a given game
//TODO finish getPerspective
async function getPerspective(roomId, player) {
	try {
        const shit2 = await Game.findOne({ roomId });
		console.log("game found for perspective roomid is " + shit2.roomId);
		const found = shit2.players.find(element => element.socketId === player);

		console.log("found player for perspective?" + found.socketId);
		// PlayerPerspective.getPerspective(found.socketId, shit2);
		return shit2;

	} catch (error) {
		return error;
	}
}

// //emissions to this service can only come from room/socket which is controlled by socket io, similar to our other fucntions
// const updateGame = (roomId, player) => {

// 	return updateGameConfig(roomId, player);
// }

const getPerspectiveFromGame = (roomId,player) => {

	return getPerspective(roomId, player);
}



module.exports = { getPerspectiveFromGame};
