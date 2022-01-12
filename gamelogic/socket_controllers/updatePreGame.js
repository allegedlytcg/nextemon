require('dotenv').config({ path: require('find-config')('.env') });
const Deck = require('../../models/Deck')

//local get deck by id request
async function getDeckById(deckIdPassed){
	try {
		const deck = await Deck.findById(deckIdPassed)
		return deck
	} catch (error) {
		return error;
	}
}

const updatePreGame =  (roomId, player, deckToFind) => {
	return getDeckById(deckToFind)
}

module.exports = { updatePreGame };
