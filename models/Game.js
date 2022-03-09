const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
	roomId: {
		type: String,
		required: true,
	},
	isComplete: false,
	players: [
		{
			
			socketId: { type: String, required: true },
			turn: false,
			cards: [
				{
					//we could add 'inDeck' property, however we can deduce from the booleans below whether it is in the deck if it meets
					//none of those categories, i.e. not isHand/isActive etc
				
					//user defined(us)
					isHand:  { type: Boolean, default: false, },
					isActive: { type: Boolean, default: false, },
					isBench:  { type: Boolean, default: false, },
					benchPos:  { type: Number, default: false, },//should always be between 0-4 if 'isBench' is true
					isPrizeCard:  { type: Boolean, default: false, },
					isDiscarded:  { type: Boolean, default: false, },
					hidden:  { type: Boolean, default: false, },
					damageCounters:  { type: Number, default: false, },//if damageCounter * 10 >= hp, the pokemon should be removed from play
					attachedEnergies: [],
	
					//api defined
					types: [String],
					retreatCost: [String],
					id: String,
					name: String,
					imageUrl: String,
					subtype: String,
					supertype: String,
					hp: String,
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
					weaknesses: [
						{
							type: { type: String },
							value: String,
						},
					],
					imageUrlHiRes: String,
					nationalPokedexNumber: Number,
					resistances: [
						{
							type: { type: String },
							value: String,
						},
					],
					
		
	
				},
			],
		},
	],
});

module.exports = Game = mongoose.model('game', GameSchema);
