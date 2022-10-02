const express = require('express');
const globalConstants = require('./utils/globalConstants');
const app = express();
const helmet = require('helmet');
require('dotenv').config();
const next = require('next');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const Game = require('./models/Game');
const { createPreGame } = require('./gamelogic/socket_controllers/createPreGame');
const { updatePreGame } = require('./gamelogic/socket_controllers/updatePreGame');
const { getStartPerspectiveRootCall } = require('./gamelogic/socket_controllers/updateGame');
const { updatePreGameCoinResult } = require('./gamelogic/socket_controllers/updatePreGame');

const { getDeckbyId } = require('./gamelogic/socket_controllers/updatePreGame');
const { getRoomSpecs } = require('./gameLogic/common/getRoomSpecs');
const getPrizeCardsActiveGame = require('./gamelogic/common/getPrizeCardsActiveGame');

var jwt = require('jsonwebtoken');

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
// database connection file
const dbConnect = require('./dbConnect');

// route files
const userRoutes = require('./routes/user');
const deckRoutes = require('./routes/deck');
const PokemonRoutes = require('./routes/pokemon');

const whitelist = [
  'http://localhost:4200',
  'http://localhost:8080',
  'https://allegedlytcg.herokuapp.com',
  'https://www.nostalgiagamestudios.com',
  'https://allegedlytcg.onrender.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (our next app)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  // needs to be true for angular and
  // same-origin for next/react
  credentials: true || 'same-origin',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
};

// connect database
dbConnect();
const PORT = process.env.PORT;

nextApp.prepare().then(() => {
	app.use(helmet()); // use all helmet provided middleware
	app.use(
		// override this to allow our app to get images from declared sources
		helmet.contentSecurityPolicy({
			directives: {
				...helmet.contentSecurityPolicy.getDefaultDirectives(),
				'script-src': ["'self'", "'unsafe-eval'"],
				'img-src': ["'self'", 'images.pokemontcg.io', 'data:'],
			},
		}),
	);

	app.use(express.json({ limit: '50mb' }));

  app.use(cors(corsOptions));

  app.use('/api/v1/user', userRoutes);
  app.use('/api/v1/deck', deckRoutes);
  app.use('/api/v1/pokemon', PokemonRoutes);

  app.all('*', (req, res) => handle(req, res));

  server.listen(PORT, err => {
    if (err) throw err;

    console.log(`Express server running on http://localhost:${PORT}`);
  });
});
const io = require('socket.io')(server, { cors: corsOptions });
const rooms = io.of('/').adapter.rooms;
const sids = io.of('/').adapter.sids;

//socketIO vars


// const req =http.request(options1, resp => {
// 	let data = ''
// 	resp.on('data', chunk => {
// 		console.log("imagine evena  chunk coming in ehre" + chunk);
// 		data += chunk
// 	})
// 	resp.on('end', () => {
// 		console.log("can we get some data here or naw?" + data);
// 		let peopleData = JSON.parse(data)
// 		console.log(peopleData)
// 	})
// })


io.on('connection', (socket) => {
	console.log('made socket connection'); //each individualclient will have a socket with the server
	console.log(socket.id); //everytime a diff computer connects, a new id will be added

	//when a new client connects, send position information
	// socket.emit("position", position);



	// verify token
	var auth = function (data) {
		// let trashtoken = "trashtoken";//trial for unauth
		try {
			const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
			let user = decoded.user;

			return { isAuth: true, data: user };//return user for single-need db transaction on deck
		} catch (err) {
			return { isAuth: false, data: null };
		}
	}



	// var auth = function (data) {
	// 	console.log("any data here in auth function " + JSON.stringify(data));
	// 	console.log("GET SECRET? " + JSON.stringify(process.env.JWT_SECRET));

	// 	jwt.verify(data.token, process.env.JWT_SECRET, function(err, decoded) {
	// 	  if (err){
	// 		socket.disconnect('unauthorized');
	// 	  }
	// 	  if (!err && decoded){
	// 		//restore temporarily disabled connection
	// 		io.sockets.connected[socket.id] = socket;

	// 		socket.decoded_token = decoded;
	// 		socket.connectedAt = new Date();

	// 		// Disconnect listener
	// 		socket.on('disconnect', function () {
	// 		  console.log('SOCKET [%s] DISCONNECTED', socket.id);
	// 		});

	// 		console.log('SOCKET [%s] CONNECTED', socket.id);
	// 		socket.emit('authenticated');
	// 		return { isAuth: true, data: data.token};//return data back and auth message to start db transaction for deck
	// 	  }
	// 	  else{
	// 		  console.log("some strange condition IN AUTH")
	// 	  }
	// 	})
	//   }


	let socketsConnectedLength = 0;
	let valueSetOfRoom = undefined;

	socket.on('join_room', async (room) => {
		let roomSpecObj = getRoomSpecs(rooms.entries(), room); //pass in set

		for (let [key, value] of rooms.entries()) {
			if (key === room) {
				valueSetOfRoom = value;
				socketsConnectedLength = value.size;
				break;
			}
		}

		//check if room is already defined amongst rooms
		if (roomSpecObj.roomSize == 0) {
			socket.join(room);
			// if we've reached this point, and there was a socket already connected, its time to start the coin toss assignment
			if (socketsConnectedLength == 1) {
				console.debug(
					'IMPL for requesting heads/tails needed here to give back result to both clients in room',
				);
			}
			roomSpecObj = getRoomSpecs(rooms.entries(), room);//update roomspec obj with newly added socket of room
		}

		// if we've reached this point, and there was a socket already connected, its time to start the coin toss assignment
		else if (roomSpecObj.roomSize == 1) {
			// lots here because 2nd socket assumed during join
			socket.join(room);
			roomSpecObj = getRoomSpecs(rooms.entries(), room);//update roomspec obj with newly added socket of room
			// replace sample call with local call with cross origin localhost
			// console.debug("room spec obj on 2 player join is " + JSON.stringify(roomSpecObj));

			let gameCreateObj = { roomId: roomSpecObj.roomName, players: [roomSpecObj.socketNames[0], roomSpecObj.socketNames[1]] };
			const pregameCreatedConfirmation = await createPreGame(gameCreateObj.roomId, gameCreateObj.players);
			// console.log("pregamecreatedconfirmation is " + pregameCreatedConfirmation)
			if (pregameCreatedConfirmation !== undefined && pregameCreatedConfirmation.gameStatus === globalConstants.PREGAME_CREATE_SUCCESS) {
				// implement echo to room indicating to client side, that we're ready to receive decks
				//this is due to nature of 'join_room' socket.io not allowing a body to be sent with the join
				console.log('pregameconfirmed success on create')

				io.to(room).emit('preGameDeckRequest', {});//client needs only signal, signifying send jwt+deck array position
			} else {
				this.logger.error("there is a bug involving pregameCreation, raise issue")
			}
		} else {
			room = null
		}
		socket.emit('joinResp', room); //sends confirmation to client by returning the room name, or null if the room was full/client already in room
	});

	//When a socket leaves, both sockets leave from room
	//TODO determine issues with disconnections/etc related to leaving room
	socket.on('leave_room', (room) => {
		//how do they leave?
		//need their room(s)
		//emit a message indicating that the 'other' user left
		io.to(room).emit('gtfo', 'boot');
		console.log('room is:', room, ' and of type ', typeof room);
		try {
			io.socketsLeave(room);
			console.log('no error happened!');
		} catch (exception_var) {
			console.log('here comes error on leave room');
			console.log(exception_var);
		} finally {
			console.log('finished socket leave on room');
		}
	});
	/*
	gamestart is triggered specifically FROM CLIENT of room X after backend tells room its ready for pregame config(decks)
	data:{token:string, deckId:string} room:string
	*/
	socket.on('preGameDeckResponse', async (data, room) => {
		//message, room
		//at this point they'v ebeen auth, joined a room, and sent their deck
		//TODO get the corresponding gameconfig object of the player of the room

		//pass deck from deck id + player socket
		let authRes = auth(data);
		if (authRes.isAuth === true) {
			//UPDATE PREGAME via room id and player id
			let deckToFind = data.deckId

			//await works on function because it is returning an asynch call, and will wait for it!
			const pregameUpdatedResult = await updatePreGame(room, socket.id, deckToFind);
			//take the result and emit coin toss if both decks are updated
			let cardsPresent = true;
			if (pregameUpdatedResult !== undefined) { //first log 
				pregameUpdatedResult.players.forEach(element => {
					if (element.cards.length > 1) {
						console.log("found cards for a player")
					}
					else {
						console.log("DID NOT FIND CARDS for one of the players");
						cardsPresent = false;
					}
				});
			}
			else {
				console.log('SOMEHOWPREGAMEuPDATED RESULT IS NOT DEFINED ');
				cardsPresent = false;
			}
			//Will send to both clients, one for waiting, 
			if (cardsPresent === true) {

				console.log("SHOULD EMIT coin toss now")
				socket.emit('reqCoinTossDecision', { "socketToDecideCoinToss": socket.id });//client needs only signal, signifying send jwt+deck array position

			}
			else {
				console.log("SHOULD EMIT coin toss decision loser because first to get here... always is second due to synchronized db activity and emissions")
				socket.emit('reqCoinTossDecisionWaitingPlayer', { "socketToDecideCoinToss": socket.id })
			}
			console.log("Cards present for both? " + cardsPresent)
			//emit to room, client will reject/approve to keep flow in agreement, backend won't allow non-socket coin decision client from happening

			// console.log("pregameCreatedConfirmation here is update result maybe", pregameUpdatedConfirmation);
		} else {
			//consider handling this situation by disconnection
			console.log("Auth users only permitted, SHOULD NOT reach this case...");
		}
	});


	//happens after pregamedeck response, and after client submits coin decision
	socket.on('coinDecision', async (data, room) => {
		//message, room
		//at this point they'v ebeen auth, joined a room, and sent their deck
		//TODO get the corresponding gameconfig object of the player of the room

		//pass deck from deck id + player socket
		let authRes = auth(data);
		if (authRes.isAuth === true) {
			//headsOrTailsChosen is property used on payload by front-end expected here

			//await works on function because it is returning an asynch call, and will wait for it!
			const pregameUpdatedCoinResult = await updatePreGameCoinResult(room, socket.id, data.headsOrTailsChosen);


			//ensures the both clients recieve necessary information to produce the coin toss and message indicating who decides play first when gameconfig initializes hereafter
			let coinResult = ''
			let coinTossPlayerChoseCorrect = false;
			if (data.headsOrTailsChosen === globalConstants.HEADSSTR) {
				if (pregameUpdatedCoinResult.coinDecisionSocketId === socket.id) {
					coinTossPlayerChoseCorrect = true;
					coinResult = globalConstants.HEADSSTR;
				}
				else {
					coinResult = globalConstants.TAILSSTR;
				}
			}
			else {
				if (pregameUpdatedCoinResult.coinDecisionSocketId === socket.id) {
					coinTossPlayerChoseCorrect = true;
					coinResult = globalConstants.TAILSSTR;
				}
				else {
					coinResult = globalConstants.HEADSSTR;
				}
			}
			console.log('coin result determined before passing to room clients is ' + JSON.stringify(coinResult) + " while winning socket is " + JSON.stringify(pregameUpdatedCoinResult.coinDecisionSocketId));
			//this merely allows animation to start by providing the coin toss function result, this way we can keep one method for responding to both
			io.to(room).emit('coinResultReady', { 'coinResult': coinResult, 'coinTossPlayerChoseCorrect': coinTossPlayerChoseCorrect });


			//we have everything we need to start the pregame, assign the player turn to the winning socket tracked by pregame confgi for now;



			//todo determine how to emit to losing socket, since we're only listening to the one socket here, perhaps emit to room?
			// if (pregameUpdatedCoinResult !== undefined) {
			// 	pregameUpdatedCoinResult.players.forEach(element => {
			// 		if (element.socketId === coinDecidingPlayer) {
			// 			console.log("found losing player")
			// 			console.log("found cards for a player")
			// 		}
			// 		else {
			// 			console.log("DID NOT FIND CARDS for one of the players");
			// 			cardsPresent = false;
			// 		}
			// 	});
			// }

			// else {
			// 	console.log('SOMEHOWPREGAMEuPDATED RESULT IS NOT DEFINED ');
			// 	cardsPresent = false;
			// }

		} else {
			//consider handling this situation by disconnection
			console.log("Auth users only permitted, SHOULD NOT reach this case...");
		}
	});


	//emit first starting perspective, strict format, may need adaptation for showing other special content(like opponents hand on trainer etc)
	socket.on('gameStart', async (data, room) => {
		//message, room
		//at this point they'v ebeen auth, joined a room, and sent their deck
		//TODO get the corresponding gameconfig object of the player of the room

		//pass deck from deck id + player socket
		let authRes = auth(data);
		if (authRes.isAuth === true) {
			//headsOrTailsChosen is property used on payload by front-end expected here
			console.log("user has requested game start of socket id " + JSON.stringify(socket.id));
			const perspective = await getStartPerspectiveRootCall(room, socket.id);

			socket.emit('showStartingPerspective', { "PlayerPerspective": perspective });//client needs only signal, signifying send jwt+deck array position


		}
		else {
			console.log('unauth user has requested game start' + JSON.stringify(socket.id));
		}
	});
	socket.on('gameUpdate', async (data, room) => {
		//message, room
		//at this point they'v ebeen auth, joined a room, and sent their deck
		//TODO get the corresponding gameconfig object of the player of the room

		//pass deck from deck id + player socket
		let authRes = auth(data);
		if (authRes.isAuth === true) {
			//headsOrTailsChosen is property used on payload by front-end expected here
			console.log("user has requested game UPDATE of socket id " + JSON.stringify(socket.id));
			const perspective = await getUpdatedPerspectiveRootCall(room, socket.id, data);

			//response to the request of a game update of any sort, energy attach, attack, everything from above root call
			socket.emit('showUpdatedPerspective', { "PlayerPerspective": perspective });//client needs only signal, signifying send jwt+deck array position


		}
		else {
			console.log('unauth user has requested game start' + JSON.stringify(socket.id));
		}
	});
});
