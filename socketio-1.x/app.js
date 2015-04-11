var server = require("net").createServer();
var io = require("socket.io")(server);

var handleClient = function (socket) {

    console.log('connection');

    //testing simple message
    socket.send('simple message send receive test');

    socket.on('message', function (msg) {

        console.log('received message: ' + msg);

	socket.send('echo: ' + msg);

    });

    //testing JSON Messages
    var msg = new Object();
    msg.name = "myname";
    msg.type = "mytype";
    socket.json.send(msg);

    //testing event handling
    var msg = new Object();
    msg.name = "myname";
    msg.type = "mytype";
    socket.emit("testevent",msg);

    socket.on("echotest", function(data) {

        console.log("received data: " + data);

        socket.emit("echotest", data);

    });

    socket.on('disconnect', function () {
        console.log('disconnect socket');
        socket.broadcast.emit('announcement', 'disconnect');
    });

};

io.on("connection", handleClient);

io.of('/testpoint').on('connection', function(socket) {
    console.log('testpoint connection');

    //testing simple message
    socket.send('simple message send receive test');

    socket.on('message', function (msg) {
        console.log(msg);

       socket.send('echo: ' + msg);

    });

    var msg = new Object();
    msg.name = "myname";
    msg.type = "mytype";
    socket.emit("testevent",msg);
    socket.on("echotest", function(data) {

        console.log(data);

        socket.emit("echotest", data);

    });

    socket.on('disconnect', function () {
        console.log('disconnect testpoint');
        socket.broadcast.emit('announcement', 'disconnect');
    });

});

server.listen(3010);
