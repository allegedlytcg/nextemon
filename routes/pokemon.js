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

// @route     GET api/v1/pokemon/grass
// @desc      Get all grass pokemon cards
// @access    public
router.get('/grass', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);
	let grass = pokemon.filter((grass) => grass.types[0] === 'Grass');
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].name === 'Double Colorless Energy')
			grass.push(allPokemon[i]);
		if (allPokemon[i].name === 'Psychic Energy') grass.push(allPokemon[i]);
		if (allPokemon[i].name === 'Grass Energy') grass.push(allPokemon[i]);
	}
	res.status(200).json(grass);
});

// @route     GET api/v1/pokemon/fire
// @desc      Get all fire pokemon cards
// @access    public
router.get('/fire', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);
	let fire = pokemon.filter((fire) => fire.types[0] === 'Fire');
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].name === 'Fire Energy') fire.push(allPokemon[i]);
		if (allPokemon[i].name === 'Double Colorless Energy')
			fire.push(allPokemon[i]);
	}
	res.status(200).json(fire);
});

// @route     GET api/v1/pokemon/psychic
// @desc      Get all psychic pokemon cards
// @access    public
router.get('/psychic', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);
	let psychic = pokemon.filter((psychic) => psychic.types[0] === 'Psychic');
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].name === 'Psychic Energy')
			psychic.push(allPokemon[i]);
		if (allPokemon[i].name === 'Double Colorless Energy')
			psychic.push(allPokemon[i]);
	}
	res.status(200).json(psychic);
});

// @route     GET api/v1/pokemon/water
// @desc      Get all water pokemon cards
// @access    public
router.get('/water', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);
	}
	let water = pokemon.filter((water) => water.types[0] === 'Water');
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].name === 'Water Energy') water.push(allPokemon[i]);
		if (allPokemon[i].name === 'Double Colorless Energy')
			water.push(allPokemon[i]);
		if (allPokemon[i].name === 'Psychic Energy') water.push(allPokemon[i]);
	}
	res.status(200).json(water);
});

// @route     GET api/v1/pokemon/colorless
// @desc      Get all colorless pokemon cards
// @access    public
router.get('/colorless', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);

	let colorless = pokemon.filter(
		(colorless) => colorless.types[0] === 'Colorless',
	);
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].supertype === 'Energy') colorless.push(allPokemon[i]);
	res.status(200).json(colorless);
});

// @route     GET api/v1/pokemon/fighting
// @desc      Get all fighting pokemon cards
// @access    public
router.get('/fighting', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);
	}
	let fighting = pokemon.filter(
		(fighting) => fighting.types[0] === 'Fighting',
	);
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].name === 'Fighting Energy')
			fighting.push(allPokemon[i]);
		if (allPokemon[i].name === 'Double Colorless Energy')
			fighting.push(allPokemon[i]);
	}
	res.status(200).json(fighting);
});

// @route     GET api/v1/pokemon/lightning
// @desc      Get all fighting pokemon cards
// @access    public
router.get('/lightning', (req, res) => {
	let pokemon = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].types) pokemon.push(allPokemon[i]);

	let lightning = pokemon.filter(
		(lightning) => lightning.types[0] === 'Lightning',
	);
	for (let i = 0; i < allPokemon.length; i++) {
		if (allPokemon[i].name === 'Lightning Energy')
			lightning.push(allPokemon[i]);
		if (allPokemon[i].name === 'Double Colorless Energy')
			lightning.push(allPokemon[i]);
	}
	res.status(200).json(lightning);
});

// @route     GET api/v1/pokemon/trainer
// @desc      Get all trainer cards
// @access    public
router.get('/trainer', (req, res) => {
	let trainerCards = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].supertype === 'Trainer')
			trainerCards.push(allPokemon[i]);
	res.status(200).json(trainerCards);
});

// @route     GET api/v1/pokemon/energy
// @desc      Get all energy cards
// @access    public
router.get('/energy', (req, res) => {
	let energyCards = [];
	for (let i = 0; i < allPokemon.length; i++)
		if (allPokemon[i].supertype === 'Energy')
			energyCards.push(allPokemon[i]);
	res.status(200).json(energyCards);
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
