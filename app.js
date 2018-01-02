//allow express to be used for file communication
var express = require('express');
var app = express();
var server = require('http').serverer(app);

//send index.html to server with express
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));

server.listen(8000); //listen on port 8000
console.log("serverer started.");

//create variables that must be updated live and sent to clients
var players = {};
var grid = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
];
var turn = 'red';
var gameOver = 'false';

var io = require('socket.io')(server,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random(); //create random ID for each socket connection and add to players
    players[socket.id] = socket;

    //delete player id when player disconnects
    socket.on('disconnect',function() {
        delete players[socket.id];
    });

    console.log('Client connected through socket ' + socket.id);

    //recieve grid data from client
    socket.on('sendGrid',function(data) {
        grid = data;
    });
    //recieve turn data from client
    socket.on('sendTurn',function(data) {
        turn = data;
    });
    //recieve gameOver data from client
    socket.on('sendGameOver',function(data) {
        gameOver = data;
    });
});

setInterval(function() {
    //send data to every client connected
    for(var i in players) {
      var socket = players[i];
      socket.emit('updateGrid',grid);
      socket.emit('updateTurn',turn);
      socket.emit('updateGameOver',gameOver);
    }


},1000/10); //updates 10 times a second
