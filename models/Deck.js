const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},
	name: {
		type: String,
		required: true,
		minlength: 4,
		maxLength: 42,
		unique: false,
	},
	active: {
		type: Boolean,
		default: false,
	},
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
});

DeckSchema.path('cards').validate(function (cards) {
	if (cards.length > 60 || cards.length === 0) return false;
	return true;
}, 'decks must have at least one card and sixty maximum');

module.exports = Deck = mongoose.model('deck', DeckSchema);
