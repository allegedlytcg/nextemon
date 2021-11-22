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
const { createGame } = require('./gamelogic/socket_controllers/createGame');
const { createPreGame } = require('./gamelogic/socket_controllers/createPreGame')
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

	server.listen(PORT, (err) => {
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

			console.log("req.user is defined? " + JSON.stringify(user));
			return { isAuth: true, data: user};//return user for single-need db transaction on deck
		} catch (err) {
			console.log("fantastic an error as usual in auth this time of socket " + err);
			return {isAuth:false, data: null};
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


	// let valueSetOfRoom = undefined;
	socket.on('join_room', (room) => {
		console.log(
			'allegedly joining a room identified by the passed string...' +
				room,
		);
		let roomSpecObj = getRoomSpecs(rooms.entries(), room); //pass in set

		for (let [key, value] of rooms.entries()) {
			if (key === room) {
				console.log(
					'found room with key of ' + key + 'and value of ' + value,
				);
				valueSetOfRoom = value;
				socketsConnectedLength = value.size;
				break;
				// for (let [key1, value1] of value.entries()) {
				// 	console.log("entry i s key:" + key1 + ", value: " + value1)

				// }
			}
		}

		console.log('entries found WAS ' + socketsConnectedLength);

		console.log(
			'On join room: rooms available are ' +
				JSON.stringify(rooms.keys()) +
				'is this room defined in adapter? ' +
				' sids whateve3 rthey are is :' +
				sids,
		); // [ <socket.id>, 'room 237' ]

		//check if room is already defined amongst rooms
		if (socketsConnectedLength <= 1) {
			console.log(
				'hit DEFINED condition ' + JSON.stringify(valueSetOfRoom),
			);
			if (valueSetOfRoom !== undefined) {
				//first log
				valueSetOfRoom.forEach((element) => {
					console.log(
						'element of room is ' + JSON.stringify(element),
					);
				});
			}
    }


		console.log(
			'On join room: rooms available are ' +
				JSON.stringify(rooms.keys()) +
				'is this room defined in adapter? ' +
				' sids whateve3 rthey are is :' +
				sids,
		); // [ <socket.id>, 'room 237' ]

		//check if room is already defined amongst rooms
		if (roomSpecObj.roomSize == 0) {
			socket.join(room);
			//TODO if we've reached this point, and there was a socket already connected, its time to start the coin toss assignment
			if (socketsConnectedLength == 1) {
				console.debug(
					'IMPL for requesting heads/tails needed here to give back result to both clients in room',
				);
			}
			roomSpecObj = getRoomSpecs(rooms.entries(), room);//update roomspec obj with newly added socket of room
			console.log("elements are hopefully (1) for first join in room " + JSON.stringify(roomSpecObj));
			// roomMap[room] = { x: 200, y: 200 };
			// //when a new client connects, send position information
			// position = roomMap[room];
			// console.log('position sent is ' + position);
			// io.to(room).emit('position', position);


			console.log('allegedly socket joined room ');
		}
		//TODO if we've reached this point, and there was a socket already connected, its time to start the coin toss assignment
		else if (roomSpecObj.roomSize == 1) {
			//TODO lots here because 2nd socket assumed during join
			socket.join(room);
			// console.log("YUMMY cookie is: " + JSON.stringify(socket.request.headers));
			roomSpecObj = getRoomSpecs(rooms.entries(), room);//update roomspec obj with newly added socket of room
			//TODO replace sample call with local call with cross origin localhost
			console.debug("room spec obj on 2 player join is " + JSON.stringify(roomSpecObj));

			let gameCreateObj = { roomId:roomSpecObj.roomName, players : [roomSpecObj.socketNames[0], roomSpecObj.socketNames[1]] };
			console.log("well gamecreateOBJ for later is " + JSON.stringify(gameCreateObj));



			//pass to preGame function
			
			const pregameCreatedConfirmation = createPreGame(gameCreateObj.roomId, gameCreateObj.players );
			console.debug("gameCreatedConfirmation should be succesfull maybe? " + JSON.stringify(pregameCreatedConfirmation));
			if(pregameCreatedConfirmation.gameStatus === globalConstants.PREGAME_CREATE_SUCCESS){
				//todo implement echo to room indicating to client side, that we're ready to receive decks
				//this is due to nature of 'join_room' socket.io not allowing a body to be sent with the join
				io.to(room).emit('preGameDeckRequest', {});//client needs only signal, signifying send jwt+deck array position
				

			}
			else{
				this.logger.error("there is a bug involving pregameCreation, raise issue")
			}

		}
		else{
			console.log(
				'room was FULL of users tell them get wrecked ' +
					'"' +
					room +
					'"',
					
			);
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

	//POC for listen event on room
	// socket.on('move', (data, room) => {
	// 	//message, room
	// 	let rooms = Object.keys(socket.rooms);
	// 	console.log(rooms); // [ <socket.id>, 'room 237' ]
	// 	console.log('something hexpressening');
	// 	console.log('direction passed is' + data);
	// 	console.log('room passed is' + room);
	// 	let position = roomMap[room];

	// 	switch (data) {
	// 		case 'left':
	// 			console.log('found left request, emitting to room');
	// 			position.x -= 5;
	// 			io.to(room).emit('moveResp', position);
	// 			break;
	// 		case 'right':
	// 			position.x += 5;
	// 			io.to(room).emit('moveResp', position);
	// 			break;
	// 		case 'up':
	// 			position.y -= 5;
	// 			io.to(room).emit('moveResp', position);
	// 			break;
	// 		case 'down':
	// 			position.y += 5;
	// 			io.to(room).emit('moveResp', position);
	// 			break;
	// 	}
	// });




	//game config and game start req/responses

	/*
	gamestart is triggered specifically FROM CLIENT of room X after backend tells room its ready for pregame config(decks)
	data:{token:string, deckId:string} room:string
	*/
	socket.on('preGameDeckResponse', (data, room) => {
		//message, room
		let authRes = auth(data);
		if(authRes.isAuth === true){
			console.debug("isauth is TRUE! user to LEVERAGE passed deckId  for is" + JSON.stringify(authRes.data) + "deck id of user to search on is " + data.deckId);
		}
		else{
			//consider handling this situation by disconnection
			console.log("Auth users only permitted, SHOULD NOT reach this case...");

		}
		let rooms = Object.keys(socket.rooms);
	
		console.log(rooms); // [ <socket.id>, 'room 237' ]
		console.log('room requetsed for pregameDeck is' + room);
		console.log('Obj listened in preGame request is' + JSON.stringify(data));
		

		//for simplicity, we locate the deck by array, and find deck the same
		//way (token extract user id) per payload

		//see if that sockets deck is there already before updating

		let updatePreGameSuccess = "";

		// switch (data) {
		// 	case 'left':
		// 		console.log('found left request, emitting to room');
		// 		position.x -= 5;
		// 		io.to(room).emit('moveResp', position);
		// 		break;
		// 	case 'right':
		// 		position.x += 5;
		// 		io.to(room).emit('moveResp', position);
		// 		break;
		// 	case 'up':
		// 		position.y -= 5;
		// 		io.to(room).emit('moveResp', position);
		// 		break;
		// 	case 'down':
		// 		position.y += 5;
		// 		io.to(room).emit('moveResp', position);
		// 		break;
		// }
	});
});
