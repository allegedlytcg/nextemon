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
					id: String,
					name: String,
					isHand: false,
					isbench: false,
					isPrizeCard: false,
					isDiscarded: false,
					hidden: false,
					damageCounters: [Number],
					attachedEnergies: [],
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
});

module.exports = Game = mongoose.model('game', GameSchema);
