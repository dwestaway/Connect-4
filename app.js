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


var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    players[socket.id] = socket;

    //delete player id when player disconnects
    socket.on('disconnect',function() {
        delete players[socket.id];
    });

    console.log('Client connected through socket ' + socket.id);

    //recieve message
    socket.on('hello',function() {
        console.log('hello from client');
    });
    //send message
    socket.emit('serverMsg',{
        msg:'hello from server',
    });
});

setInterval(function() {
    var pack = [];
    for(var i in players) {
        var socket = players[i];
        socket.x++;
        socket.y++;
        pack.push ({
          x:socket.x,
          y:socket.y
        });
    }
    for(var i in players) {
      var socket = players[i];
      socket.emit('updateGrid',pack);
    }

},1000/10);
