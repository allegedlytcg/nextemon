const express = require('express');
const app = express();
const helmet = require('helmet');
require('dotenv').config();
const next = require('next');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);

const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
// database connection file
const dbConnect = require('./dbConnect');

// route files
const userRoutes = require('./routes/user');
const deckRoutes = require('./routes/deck');
const PokemonRoutes = require('./routes/pokemon');
const gameRoutes = require('./routes/game');

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

console.log("port is " + PORT);

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
	app.use('/api/v1/game', gameRoutes);

	app.all('*', (req, res) => handle(req, res));6

	server.listen(PORT, (err) => {
		if (err) throw err;

		console.log(`Express server running on http://localhost:${PORT}`);
	});
});
const io = require('socket.io')(server, { cors: corsOptions });

let roomMap = {}; // holds All of the active rooms of the server
io.on('connection', (socket) => {
	console.log('made socket connection'); //each individualclient will have a socket with the server
	console.log(socket.id); //everytime a diff computer connects, a new id will be added
	//when a new client connects, send position information
	// socket.emit("position", position);

	socket.on('join_room', (room) => {
		console.log(
			'allegedly joining a room identified by the passed string...' +
				room,
		);
		let tempRoom = room; //whats ultimately sent back to client based on circumstances
		let rooms = Object.keys(socket.rooms);
		let thisRoom = io.sockets.adapter.rooms[room];
		console.log(rooms); // [ <socket.id>, 'room 237' ]

		if (typeof thisRoom !== 'undefined') {
			if (thisRoom.length == 0) {
				console.log(
					'no clients in that room, or is undefined creating room now',
				);
				socket.join(room); //room that socket/user wants to join
			} else if (thisRoom.length == 1) {
				console.log('joining 2nd client');
				socket.join(room);
			} else if (thisRoom.length == 2) {
				console.log('full room');
				console.log("here's a list of the connected clients:");
				let room = io.sockets.adapter.rooms['my_room'];
				//`` console.log(room[0]);
				// console.log(room[1]);``
				tempRoom = null;
			}
			// clientsSockets = clients.sockets;
			// numClients = (typeof clientsSockets !== 'undefined') ? Object.keys(clients).length: 0;
			// for (var clientId in clientsSockets ){
			//     //socket of each client in the room
			//     var clientSocket = io.sockets.connected[clientId];
			//     console.log(clientSocket);
			// }
		} else {
			console.log(
				'room was undefined, joining and creating new room' + room,
			);
			socket.join(room);
			roomMap[room] = { x: 200, y: 200 };
			//when a new client connects, send position information
			position = roomMap[room];
			console.log('position sent is ' + position);
			io.to(room).emit('position', position);
		}
		socket.emit('joinResp', tempRoom); //sends confirmation to client by returning the room name, or null if the room was full/client already in room
	});

	socket.on('leave_room', (room) => {
		//how do they leave?
		//need their room(s)
		//emit a message indicating that the 'other' user left
		io.to(room).emit('gtfo', 'boot');

		console.log('room is ', room, ' and of type ', typeof room);

		try {
		} catch (error) {}

		try {
			io.socketsLeave(room);
			console.log('no error happened!');
		} catch (exception_var) {
			console.log('here comes error');
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
