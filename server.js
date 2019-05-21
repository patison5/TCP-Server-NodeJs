var net = require("net");

var port = 8282;
var sockets = [];

var messages = []

var tcpServer = net.createServer();

tcpServer.on('connection', function(socket){
	console.log('\x1b[36m%s\x1b[0m', 'connection established');
	
	socket.setEncoding('utf8');

	sockets.push(socket);

	socket.on('data', function(data){
		var dataJSON = JSON.parse(data);


		if (dataJSON.state === 'login') {
			for(var i=0; i < sockets.length;i++) {
				if(sockets[i] === socket) {
					sockets[i].userName = dataJSON.name;
				}
			}
		} else if (dataJSON.state === 'broadcast') {
			messages.push(dataJSON);
			
			for(var i=0; i < sockets.length;i++) {
				sockets[i].write(JSON.stringify(messages));
			}

		} else if (dataJSON.state === 'private') {
			messages.push(dataJSON);

			console.log(messages)

			for(var i=0; i < sockets.length;i++) {

				if (sockets[i] === socket) {
					sockets[i].write(JSON.stringify(messages));
				}

				if (sockets[i].userName === dataJSON.reciever) {
					sockets[i].write(JSON.stringify(messages));
				}
		
			}
		}
	});

	socket.on('end', function(){
		console.log('user disconnected...')
		sockets.splice(sockets.indexOf(socket),1);
	});

});


tcpServer.listen(port, function() { 
	console.log(`server is listening on port: ${port}`);
});