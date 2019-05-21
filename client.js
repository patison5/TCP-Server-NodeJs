const net = require('net');
const readline = require('readline');
var readlineSync = require('readline-sync');
const chalk = require('chalk');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


colors = [
  '\x1b[33m%s\x1b[0m',
  '\x1b[36m%s\x1b[0m'
]

// console.log('\x1b[36m%s\x1b[0m', 'I am cyan');

var nickname = 'pid'
var updateData = false;

function clearConsole () {
	//clearing console
	process.stdout.write('\033c');
}


var client = net.connect({
	port: 8282, 
	// host: '46.39.41.8'
  host: 'localhost'

}, 
function() {
	console.log('\x1b[36m%s\x1b[0m', 'connected to server!'); 
	checkRegister();
});


function checkRegister() {
	rl.question(chalk.red(`Введите никнейм `), (answer) => {
		nickname = answer;

		client.write(JSON.stringify({
			'state': 'login',
			'name': nickname
		}))	

		readAndSend();
	});
}

client.on('data', function(data) {
	var dataJSON = JSON.parse(data);

	clearConsole();

	for (let i = 0; i < dataJSON.length; i++) {
		console.log('\x1b[33m%s\x1b[0m', `${dataJSON[i].name} > ${dataJSON[i].message}`);
	}
	
	updateData = true;

	if (updateData === true)
		readAndSend();

	// client.end();
})





function readAndSend () {
	updateData = false;

	rl.question(chalk.red(`${nickname} > `), (answer) => {

		// var nickname = answer.split(' ')[0];

		if (answer[0] == '#') {
			answer = answer.split(' ');

			var reciever = answer[0];
				reciever = reciever.slice(1)

			answer.splice(0, 1);
			answer = answer.join(' ')

			client.write(JSON.stringify({
				'state': 'private',
				'name': nickname,
				'message': answer,
				'reciever': reciever
			}))	

		} else {
			client.write(JSON.stringify({
				'state': 'broadcast',
				'name': nickname,
				'message': answer
			}))	
		}

		

		// readAndSend();
	});
}