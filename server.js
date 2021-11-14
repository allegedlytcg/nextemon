const express = require('express');
const app = express();
const helmet = require('helmet');
require('dotenv').config();
const next = require('next');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const Game = require('./models/Game');
const { getRoomSpecs } = require('./gameLogic/common/getRoomSpecs')
const getPrizeCardsActiveGame = require('./gamelogic/common/getPrizeCardsActiveGame');

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
let roomMap = {};
io.on('connection', (socket) => {
	console.log('made socket connection'); //each individualclient will have a socket with the server
	console.log(socket.id); //everytime a diff computer connects, a new id will be added

	//when a new client connects, send position information
	// socket.emit("position", position);

	let socketsConnectedLength = 0;
	let valueSetOfRoom = undefined;

	// let valueSetOfRoom = undefined;
	socket.on('join_room', (room) => {
		console.log(
			'allegedly joining a room identified by the passed string...' +
				room,
		);
		let roomSpecObj = getRoomSpecs(rooms.entries(), room);//pass in set

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
		// for (let [key, value] of rooms.entries()) {
		// 	if (key === room) {
		// 		console.log("found room with key of " + key + "and value of " + value);
		// 		valueSetOfRoom = value;
		// 		socketsConnectedLength = value.size;
		// 		break;
		// 	}

		// }




		console.log("On join room: rooms available are " + JSON.stringify(rooms.keys()) + "is this room defined in adapter? " + " sids whateve3 rthey are is :" + sids); // [ <socket.id>, 'room 237' ]

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
			roomMap[room] = { x: 200, y: 200 };
			//when a new client connects, send position information
			position = roomMap[room];
			console.log('position sent is ' + position);
			io.to(room).emit('position', position);

			console.log("allegedly socket joined room ");

		}
		//TODO if we've reached this point, and there was a socket already connected, its time to start the coin toss assignment
		else if (roomSpecObj.roomSize == 1) {
			//TODO lots here because 2nd socket assumed during join
			socket.join(room);
			roomSpecObj = getRoomSpecs(rooms.entries(), room);//update roomspec obj with newly added socket of room

			console.log("elements are hopefully(2) with second join in room " + JSON.stringify(roomSpecObj));
			console.debug("IMPL for requesting heads/tails needed here to give back result to both clients in room")

		}
		else {
			console.log(
				'room was FULL of users tell them get wrecked ' +
					'"' +
					room +
					'"',
			);
			room = null;
		}
		socket.emit('joinResp', room); //sends confirmation to client by returning the room name, or null if the room was full/client already in room
	});





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

		// io.of('/').in('chat').clients((error, socketIds) => {
		// 	if (error) throw error;

		// 	socketIds.forEach(socketId => io.sockets.sockets[socketId].leave(room));

		//   });
	});
	// io.of("/").adapter.on("delete-room", (room) => {

	// 	console.log(`deleted room ${room}`);
	// 		io.to(room).emit('gtfo', 'boot');
	//   });
	//TODO CHANGE THIS TO BOOKMARKED CONNECT/DISCONNECT METHO
	//     socket.on("disconnect", (room) =>{

	//         let thisRoom = io.sockets.adapter.rooms[room];
	//  // todo check if client is in that room
	//         if (typeof thisRoom !== 'undefined'){

	//             socket.leave(room);
	//             if (thisRoom.length == 0){
	//                 io.emit('lobbyUpdate', room){
	//                     //remove the roomname from all client lobby list
	//                 }
	//             }

	//         }
	//         else{
	//             console.log("an issue where the room wasn't found occured")
	//         }
	//     });

	//now listening for custom events fromc lient
	//TODO CHANGE FRONT-END TO PASS STATE RATHER THAN GLOBAL STATE OF POSITION HERE
	//TODO CHANGE THIS METHOD TO TAKE AN ADDITIONAL ARGUMENT FROM FRONT END
	socket.on('move', (data, room) => {
		//message, room
		let rooms = Object.keys(socket.rooms);
		console.log(rooms); // [ <socket.id>, 'room 237' ]
		console.log('something hexpressening');
		console.log('direction passed is' + data);
		console.log('room passed is' + room);
		let position = roomMap[room];

		switch (data) {
			case 'left':
				console.log('found left request, emitting to room');
				position.x -= 5;
				io.to(room).emit('moveResp', position);
				break;
			case 'right':
				position.x += 5;
				io.to(room).emit('moveResp', position);
				break;
			case 'up':
				position.y -= 5;
				io.to(room).emit('moveResp', position);
				break;
			case 'down':
				position.y += 5;
				io.to(room).emit('moveResp', position);
				break;
		}
	});
});
