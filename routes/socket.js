var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');

// export function for listening to the socket
module.exports = function (socket) 
{
    var room;
    var username;
	// send the new user their name and a list of users
	socket.emit('init', 
	{
		connection: 'success'
	});

	socket.on('join', function(data)
    {
        room = data.room;
        username = data.username;
        socket.join(room);
        socket.broadcast.to(room).emit('new:joined',
            {
                username: username
            });
    });

    socket.on('disconnect', function()
    {
        socket.broadcast.to(room).emit('exit',
            {
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
	// notify other clients that a new user has joined
	/*socket.broadcast.emit('user:join',
	{
		socket.broadcast.emit('new:campaign');
	});
};*/
