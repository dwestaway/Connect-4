var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use(express.static(__dirname + '/client'));
//app.use('/client',express.static(__dirname + '/client'));

//listen on port 2000
serv.listen(2000);
console.log("Server started.");

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

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    //socket.x = 0;
    //socket.y = 0;
    players[socket.id] = socket;

    //delete player id when player disconnects
    socket.on('disconnect',function() {
        delete players[socket.id];
    });

    console.log('Client connected through socket ' + socket.id);

    //recieve grid data
    socket.on('sendGrid',function(data) {
        grid = data;
    });
    //recieve turn data
    socket.on('sendTurn',function(data) {
        turn = data;
    });
    //recieve gameOver data
    socket.on('sendGameOver',function(data) {
        gameOver = data;
    });
});

setInterval(function() {

    for(var i in players) {
      var socket = players[i];
      socket.emit('updateGrid',grid);
      socket.emit('updateTurn',turn);
      socket.emit('updateGameOver',turn);
    }

},1000/10); //updates 10 times a second
