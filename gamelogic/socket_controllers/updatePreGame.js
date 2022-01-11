require('dotenv').config({ path: require('find-config')('.env') });

const { MongoClient, ObjectID } = require('mongodb');
// const Deck = require('../../models/Deck');


 const updatePreGame =  (roomId, player, deckToFind) => {
	console.log("deckTofind '_id' for 'decks' is: " + JSON.stringify(deckToFind));
	return getDeckById(deckToFind)
}

//local get deck by id request
async function getDeckById(deckIdPassed){
	try {
		
		return MongoClient.connect(
			process.env.MONGO_DB,
			{ useUnifiedTopology: true },
			async (err, db) => {
				if (err) throw err;
				const mainDb = db.db('test');

				const collection = mainDb.collection('decks');
				let collectionCount = collection.find();
				let countcount = await collectionCount.count();
				console.log("deck ID just befoRE QUERY" + JSON.stringify(deckIdPassed));
				console.log("ALL decks IN COLLECTION COUNT IS: " + (countcount));
				let result = await collection.findOne({ _id: ObjectID(`${deckIdPassed}`) });
		        console.log("result of local FINDDECK  is" + JSON.stringify(result));
				db.close()
				return result ;

			}
			
			);


	} catch (error) {
		return error;
	}
 

}

module.exports = { updatePreGame };
