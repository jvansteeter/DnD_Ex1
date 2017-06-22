var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');

// export function for listening to the socket
module.exports = function (socket) 
{
    var room;
	var id;
    var username;
	// send the new user their name and a list of users
	socket.emit('init', 
	{
		connection: 'success'
	});

	socket.on('join', function(data)
    {
        room = data.room;
		id = data.id;
        username = data.username;
        socket.join(room);
        socket.broadcast.to(room).emit('new:joined', username);
    });

    socket.on('disconnect', function()
    {
        socket.broadcast.to(room).emit('exit', {
			id: id,
			username: username
		});
    });

	socket.on('new:encounter', function(data)
	{
		socket.broadcast.emit('new:encounter');
	});

	socket.on('update:encounter', function(data)
	{
		socket.broadcast.to(room).emit('update:encounter');
	});

	socket.on('update:player', function(data)
	{
		socket.broadcast.to(room).emit('update:player', data);
	});

	socket.on('encounter:end', function(data)
	{
		socket.broadcast.emit('encounter:end',
		{
			encounterID : data.encounterID
		});
	});

	socket.on('new:campaign', function(data)
	{
		socket.broadcast.emit('new:campaign');
	});
};