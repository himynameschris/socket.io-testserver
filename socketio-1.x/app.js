var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var handleClient = function (socket) {

    console.log('connection');

    //testing simple message
    socket.send('Simple message test from default namespace');

    socket.on('message', function (msg) {

        console.log('Default namespace received message: ' + msg);
		
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

        console.log("Default namespace echotest event received data: " + data);

        socket.emit("echotest", data);

    });

    socket.on('disconnect', function () {
        console.log('disconnect socket default namespace');
        socket.broadcast.emit('announcement', 'disconnect');
    });

};

io.on("connection", handleClient);

io.of('/testpoint').on('connection', function(socket) {
    console.log('testpoint connection');

    //testing simple message
    socket.send('Simple message test from testpoint endpoint');

    socket.on('message', function (msg) {

	   console.log('Test endpoint /testpoint received simple message: ' + msg);

	   socket.send('echo: ' + msg);

    });

    var msg = new Object();
    msg.name = "myname";
    msg.type = "mytype";
    socket.emit("testevent",msg);
	
    socket.on("echotest", function(data) {

        console.log("Test endpoint '/testpoint' event echotest received data: " + data);

        socket.emit("echotest", data);

    });

    socket.on('disconnect', function () {
        console.log('disconnect testpoint');
        socket.broadcast.emit('announcement', 'disconnect');
    });

});

var listen = function() {
	http.listen(3010);
}

module.exports.listen = listen;



