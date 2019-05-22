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


var nickname = 'pid'
var updateData = false;

function clearConsole () {
	//clearing console
	process.stdout.write('\033c');
}

rl.question(chalk.green(`Write IP `), (IP) => {
	rl.question(chalk.green(`Write PORT `), (PORT) => {

		startMainLoop(IP, PORT);
	});
});




function startMainLoop (IP, PORT) {
	
	console.log(chalk.green('Connecting to '), chalk.green(`${IP || 'localhost'}:${PORT || 8282}`))

	var client = net.connect({
		port: PORT || 8282, 
		// host: '46.39.41.8'
		host: IP || 'localhost'
	}, 
	function() {
		console.log(chalk.green('connected to server!')); 
		checkRegister();
	});


	function checkRegister() {

		console.log(
			'\x1b[36m%s\x1b[0m',
			'\n' +
			'========================================='+
			'\n------------ TCP-CHAT-SERVER ------------\n' +
			'=========================================\n\n'+
			'         WELCOME TO MY COURSEWORK!\n\n'+

	        '        ("`-’-/").___..--’’"`-._\n' +
	        '         `6_ 6  )   `-.  (     ).`-.__.‘)\n' +
	        '         (_Y_.)’  ._   )  `._ `. ``-..-’\n' +
	        '       _..`--’_..-_/  /--’_.’ ,’\n' +
	        '      (il),-’‘  (li),’  ((!.-‘\n' +
	        '\n              - Created by - \n' +
	        '========================================='+
			'\n--------------- @patison5 ---------------\n' +
			'=========================================\n\n'
	    );

		rl.question(chalk.green(`Write nickname `), (answer) => {
			nickname = (answer || "default user").toUpperCase();

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
			if (dataJSON[i].state != 'private') {
				if (dataJSON[i].name === nickname)
					console.log(chalk.green(`  ${dataJSON[i].name} > `), `${dataJSON[i].message}`);
				else
					console.log('\x1b[33m%s\x1b[0m', `  ${dataJSON[i].name} > `, `${dataJSON[i].message}`);
			} 
			else if ((dataJSON[i].reciever === nickname) || (dataJSON[i].name === nickname)) {
				console.log('\x1b[36m%s\x1b[0m', `  ${dataJSON[i].name} > `, `${dataJSON[i].message}`);
			}
		}
		
		updateData = true;

		if (updateData === true)
			readAndSend();
	})





	function readAndSend () {
		updateData = false;

		rl.question(chalk.red(`  ${nickname} > `), (answer) => {

			if (answer === ":q") {
				console.log(chalk.green("\т  Buy!..."))
				client.end();
				rl.close();
				return
			}


			if (answer[0] == '#') {
				answer = answer.split(' ');

				var reciever = answer[0];
					reciever = reciever.slice(1)

				answer.splice(0, 1)
					  .join(' ');

				client.write(JSON.stringify({
					'state': 'private',
					'name': nickname,
					'message': answer,
					'reciever': reciever.toUpperCase()
				}))	

			} else {
				client.write(JSON.stringify({
					'state': 'broadcast',
					'name': nickname,
					'message': answer
				}))	
			}
		});
	}


	client.on('end', function(data) {
		console.log(chalk.green("  Disconnected from server..."))
	})
}