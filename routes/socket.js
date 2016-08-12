var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');

// export function for listening to the socket
module.exports = function (socket) 
{
	console.log('---!!! Connection has been intialized !!!---');
	// send the new user their name and a list of users
	socket.emit('init', 
	{
		connection: 'success'
	});

	socket.on('new:encounter', function(data)
	{
		console.log("---!!! RECEIVED MESSAGE ABOUT NEW ENCOUNTER !!!---");
		socket.broadcast.emit('new:encounter');
	});

	socket.on('update:encounter', function(data)
	{
		console.log("---!!! RECEIVED MESSAGE TO UPDATE ENCOUNTER !!!---");
		socket.broadcast.emit('update:encounter',
		{
			encounterID : data.encounterID
		});
	});

	socket.on('encounter:end', function(data)
	{
		socket.broadcast.emit('encounter:end',
		{
			encounterID : data.encounterID
		});
	});

	socket.on('new:campaign', function(data)
	// notify other clients that a new user has joined
	/*socket.broadcast.emit('user:join',
	{
		socket.broadcast.emit('new:campaign');
	});
};
