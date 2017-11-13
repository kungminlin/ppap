var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
    
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/three.js', function(req, res) {
  res.sendFile(__dirname + '/three.js');
}); 

app.get('/bundle.js', function(req, res) {
    res.sendFile(__dirname + '/bundle.js');
});

var cubes = [];
var users = [];

io.on('connection', function(socket) {
  console.log(socket.id + ' has connected');
  socket.emit('client connect', socket.id);
  socket.emit('objects', cubes);
  socket.on('add object', function(obj){
    console.log("creating object at " + obj.x + ", " + obj.y + ", " + obj.z + ", with color " + obj.color);
    io.sockets.emit('add object', {x:obj.x, y:obj.y, z:obj.z, color:obj.color});
  });
  socket.on('objects', function(obj){
    cubes.push(obj);
    io.sockets.emit('objects', cubes);
  });
  socket.on('add user', function(coords){
    console.log("user " + coords.name + " located at " + coords.x + ", " + coords.y + ", " + coords.z + ", with color " + coords.color);
    users.push(coords);
    io.sockets.emit('users', users);
  });
  // if (typeof users !== 'undefined' && users.length > 0) {
  //   var n = Math.floor(Math.random()*users.length);
  //   console.log(n);
  //   socket.emit('camera target', users[n]);
  // }
  socket.on('disconnect', function(){
    console.log(socket.id + ' has disconnected');
    user = users[users.findIndex(x => x.name==socket.id)];
    io.sockets.emit('remove user', user);
  });
});

// var userNum = 0;

// io.on('connection', function(socket){
//   var addedUser = false;
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
//   socket.on('get user', function(username){
//     if (addedUser) {
//       io.emit('added user', username);
//       return;
//     }
//     if (username.trim() === "") username="Anonymous";
//     socket.username = username;
//     ++userNum;
//     addedUser = true;
//     io.emit('get user', username);
//     io.emit('added user', username);
//   });
//   socket.on('chat message', function(msg){
//     console.log(socket.username + ': ' + msg);
//     io.emit('chat message', msg);
//   });
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});