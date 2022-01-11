// const pokemon = require('pokemontcgsdk'); // <--------https://github.com/PokemonTCG/pokemon-tcg-sdk-javascript
const { MongoClient } = require('mongodb');
const router = require('express').Router();

let allPokemon; // variable we set equal to the pokemon collection on the mongo database
// starter deck variables
let blackout;
let waterblast;
let brushfire;
let overgrowth;
let powerreserve;
let zap;

MongoClient.connect(
	process.env.MONGO_DB,
	{ useUnifiedTopology: true },
	async (err, db) => {
		if (err) throw err;
		let pokemonDB = db.db('test');
		allPokemon = await pokemonDB.collection('pokemon').find().toArray();
		blackout = await pokemonDB.collection('blackout').find().toArray();
		waterblast = await pokemonDB.collection('waterblast').find().toArray();
		brushfire = await pokemonDB.collection('brushfire').find().toArray();
		overgrowth = await pokemonDB.collection('overgrowth').find().toArray();
		zap = await pokemonDB.collection('zap').find().toArray();
		powerreserve = await pokemonDB
			.collection('powerreserve')
			.find()
			.toArray();
		db.close();
	},
);

// @route     GET api/v1/pokemon
// @desc      Get all cards
// @access    public
router.get('/', async (req, res) => {
	try {
		// i have now inserted the api data in my database so we'll try to hit it that way
		res.status(200).send(allPokemon);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('server error');
	}
});

// @route     GET api/v1/pokemon/:deckname
// @desc      get starter deck by name
// @access    public
router.get('/overgrowth', (req, res) => res.status(200).json(overgrowth));
router.get('/zap', (req, res) => res.status(200).json(zap));
router.get('/brushfire', (req, res) => res.status(200).json(brushfire));
router.get('/blackout', (req, res) => res.status(200).json(blackout));
router.get('/powerreserve', (req, res) => res.status(200).json(powerreserve));
router.get('/waterblast', (req, res) => res.status(200).json(waterblast));

module.exports = router;
