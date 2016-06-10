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

	socket.on('new:encounterPlayer', function(data)
	{
		console.log("---!!! RECEIVED MESSAGE ABOUT NEW PLAYER !!!---");
		socket.broadcast.emit('new:encounterPlayer',
		{
			encounterID : data.encounterID
		});
	});

	// notify other clients that a new user has joined
	/*socket.broadcast.emit('user:join', 
	{
		name: name
	});

	// broadcast a user's message to other users
	socket.on('send:message', function (data) 
	{
		socket.broadcast.emit('send:message', 
		{
			user: name,
			text: data.message
		});
	});

	// validate a user's name change, and broadcast it on success
	socket.on('change:name', function (data, fn) 
	{
		if (userNames.claim(data.name)) 
		{
			var oldName = name;
			userNames.free(oldName);

			name = data.name;
	  
			socket.broadcast.emit('change:name', 
			{
				oldName: oldName,
				newName: name
			});

			fn(true);
		} 
		else 
		{
			fn(false);
		}
	});

	// clean up when a user leaves, and broadcast it to other users
	socket.on('disconnect', function () 
	{
		socket.broadcast.emit('user:left', 
		{
			name: name
		});
		userNames.free(name);
	});*/
};
