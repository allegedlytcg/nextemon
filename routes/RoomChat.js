const router = require('express').Router();
const auth = require('../middleware/auth');
const { SSL_OP_NO_TICKET } = require('constants');
const { createSocket } = require('dgram');
const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(4005, () => {
    console.log("Listening at :4005...");
});


Socketio.on("connection", socket => {
    console.log('made socket connection to rooms impl');//each individualclient will have a socket with the server
    console.log(socket.id);//everytime a diff computer connects, a new id will be added
    //client will pass room with this event
    socket.on("join_room", room =>{
        socket.join(room);//room that socket/user wants to join
    });

    //effectively, this is expecting an adequate 'room' object from the client, along with a message
    socket.on("message", ({room, message}) =>{
        //message, room

        //here's how we're sending data to all sockets in a particular room
        socket.to(room).emit("message", {
            message, 
            name: "Friend"
        });
    })
    //anothe rexample
    socket.on("typing", ({room}) =>{
        //message, room

        //here's how we're sending data to all sockets in a particular room
        socket.to(room).emit("typing", "Someone is typing");
    })

});







module.exports = router;