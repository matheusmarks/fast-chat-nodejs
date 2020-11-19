/**
 * 
 * @author Matheus Marques <marquesmatheusoliveira01@gmail.com>
 * 
 * 
 * 
 * database
 * @type {Object}
 * 
 * app
 * @type {any}
 * 
 * Online Users
 * @type {number}
 * 
 * messages
 * @type {array}
 * 
 * 
 */


const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const database = require('./src/database/connection');


let onlineUsers = 0;
let messages = [];


/**
 * @function 
 * @async*/
io.on('connection', async (socket) => {

    // Sucess
    console.log(`You just connected to Socket.io congrats ${socket.id}`);

    socket.on('newUserConnected', (user) => {
        onlineUsers++;

        io.sockets.emit('users', onlineUsers);
    });


    // Sending all the messages
    const allMessages = await database.listAllMessages((error, data) => {
        if (error) return console.log(error);

        messages.push(allMessages);
        return data;
    });

    socket.emit('messages', allMessages);

    // Recieving a single message and broadcast it to other users
    socket.on('receivedMessage', msg => {
        const message = {
            user: msg['user'],
            message: msg['message'],
        }

        database.createMessage(message, (error, result) => {
            if (error) {
                return console.log(error);
            }
        });

        io.sockets.emit('message', message);
    });

    socket.on('disconnectedUser', user => {
        onlineUsers--;

        io.sockets.emit('users', onlineUsers);
    });
});

server.listen(3000, () => console.log(`Server running on port 3000`));
