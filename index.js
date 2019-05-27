const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', (socket) => {
    console.log("Client: " + socket.id);

    socket.on('connected', (username) => {
        socket.username = username;
        socket.broadcast.emit('notice', username + ' s\'est connecté.');
    });

    socket.on('disconnect', () => {
        //socket.broadcast.emit('notice', socket.username + ' s\'est déconnecté.');
        socket.broadcast.emit('leave', socket.username);
        socket.username = null;
    });

    socket.on('starting', () => {
        socket.broadcast.emit('notice', socket.username + ' a commencé à jouer.');
    });

    socket.on('hole', (hole) => {
        socket.broadcast.emit('notice', socket.username + ' a fini le trou n°' + hole + '.');
    });

    socket.on('finished', (data) => {
        socket.broadcast.emit('notice', socket.username + ' a fini le parcours en ' + data.strokes + ' coups (score : ' + data.score + ').');
    });

    socket.on('spawn', (data) => {
        console.log(data);
        socket.broadcast.emit('spawned', { data: data, user: socket.username });
    });

    socket.on('shot', (data) => {
        console.log(data);
        socket.broadcast.emit('shoot', { data: data, user: socket.username });
    });
});