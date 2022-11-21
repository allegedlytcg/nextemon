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
			energyAttachedThisTurn: false,
			turn: false,
			cards: [
				{
					//we could add 'inDeck' property, however we can deduce from the booleans below whether it is in the deck if it meets
					//none of those categories, i.e. not isHand/isActive etc
				
					//user defined(us)
					isHand:  { type: Boolean, default: false, },
					isActive: { type: Boolean, default: false, },
					isBench:  { type: Boolean, default: false, },
					isInDeck: { type:Boolean, default: true},//must explicitly toggle off when deck modified
					benchPos:  { type: Number, default: -1, },//should always be between 1-5 if 'isBench' is true
					isPrizeCard:  { type: Boolean, default: false, },
					isDiscarded:  { type: Boolean, default: false, },
					hidden:  { type: Boolean, default: false, },
					damageCounters:  { type: Number, default: 0, },//if damageCounter * 10 >= hp, the pokemon should be removed from play
					//for all 'attachedAs' number indicates bench position/active pokemon, default is -1 interpreted as N/a
					attachedAsEnergy: { type: Number, default: -1, },
					attachedAsEvo:{type:Number, default:-1},
					attachedAsTrainer:{type:Number, default:-1}, //for stupid defender and plus power that no one should use
	
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
