const mongoose = require('mongoose');

//pregame schema used to set 'ready' flags due to multiple req/response needed to synchronize game on room
//detail: need to query and or update and use as flags to determine action at the 3 states(none, 1, and both ready)
//once both ready, we can use to create the game since we have user decks/everything needed to start
const PregameSchema = new mongoose.Schema({
	roomId: {
		type: String,
		required: true,
	},
	players: [
		{
			
			socketId: { type: String, required: true},
            //default [] important for ready check, 2 players/non-empty deck signifies ready
			cards: [
                {
                    id: String,
                    name: String,
                    nationalPokedexNumber: Number,
                    imageUrl: String,
                    imageUrlHiRes: String,
                    types: [String],
                    supertype: String,
                    subtype: String,
                    hp: String,
                    retreatCost: [String],
                    convertedRetreatCost: Number,
                    number: String,
                    artist: String,
                    rarity: String,
                    series: String,
                    set: String,
                    setCode: String,
                    attacks: [
                        {
                            cost: [String],
                            name: String,
                            text: String,
                            damage: String,
                            convertedEnergyCost: Number,
                        },
                    ],
                    resistances: [
                        {
                            type: { type: String },
                            value: String,
                        },
                    ],
                    weaknesses: [
                        {
                            type: { type: String },
                            value: String,
                        },
                    ],
                },
            ],
		},
	],
}, {collection: 'pregames'});//its this by default from mongooses weird ass nature but I like explicit =)
//TODO determine if validation triggers when socket1/socket2cards not provided or keep removed
// PregameSchema.path('cards').validate(function (cards) {
// 	if (cards.length > 60 || cards.length === 0) return false;
// 	return true;
// }, 'decks must have at least one card and sixty maximum');

module.exports = Pregame = mongoose.model('pregame', PregameSchema);
