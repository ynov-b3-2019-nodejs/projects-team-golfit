const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
/* const mysql = require('mysql');

const db = mysql.createConnection ({
    host: '127.0.0.1',
    port: '8888',
    user: 'root',
    password: 'password',
    database: 'golfit'
}); */

/* db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connexion à la DB');
});
global.db = db;
 */
server.listen(3000);
app.use(express.static('public'));

let users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', (socket) => {

    socket.on('connected', (username) => {
        users[username] = { lvl: 0, pos: { x: 0, y: 0 } };
        socket.username = username;
        socket.broadcast.emit('notice', username + ' a commencé une partie.')
        
    });

    socket.on('disconnect', () => {
        if(socket.username != null) {
            delete users[socket.username];
            socket.broadcast.emit('leave', socket.username);
            socket.username = null;
        }
    });

    socket.on('restarting', () => {
        socket.broadcast.emit('notice', socket.username + ' a recommencé une partie.');
    });

    socket.on('hole', (hole) => {
        socket.broadcast.emit('overlap', { lvl: hole, user: socket.username });
    });

    socket.on('finish', (data) => {
        socket.broadcast.emit('notice', socket.username + ' a fini le parcours en ' + data.strokes + ' coups (score : ' + data.score + ').');
    });

    socket.on('spawn', (data) => {
        users[socket.username] = { lvl: data.lvl, pos: { x: data.x, y: data.y } };
        socket.broadcast.emit('spawned', { data: data, user: socket.username });
        socket.emit('users', users);
        /* db.query(`INSERT INTO username (pseudo, score) VALUES ("Titou", "0")`, (err, result) => {
            if(err) throw err;
                console.log("Nouveau pseudo ajouté");
            }); */
    });

    socket.on('shot', (data) => {
        socket.broadcast.emit('shoot', { data: data, user: socket.username });
    });
});