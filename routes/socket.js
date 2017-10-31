var mongoose = require('mongoose');
var Encounter = mongoose.model('Encounter');
var encounterService = require('../services/encounterService');
var errorService = require('../services/errorService');

// export function for listening to the socket
module.exports = function (socket) 
{
    var encounterId;
	var userId;
    var username;
	// send the new user their name and a list of users
	socket.emit('init', 
	{
		connection: 'success'
	});

	socket.on('join', function(data)
    {
        encounterId = data.room;
		userId = data.id;
        username = data.username;
        socket.join(encounterId);
        socket.broadcast.to(encounterId).emit('new:joined', username);
    });

    socket.on('disconnect', function()
    {
        socket.broadcast.to(encounterId).emit('exit', {
			id: userId,
			username: username
		});
    });

	socket.on('new:encounter', function(data)
	{
		socket.broadcast.emit('new:encounter');
	});

	socket.on('update:encounter', function(data)
	{
		socket.broadcast.to(encounterId).emit('update:encounter');
	});

	socket.on('update:player', function(player)
	{
		socket.broadcast.to(encounterId).emit('update:player', player);
	});

	socket.on('add:player', function(player)
	{
		socket.broadcast.to(encounterId).emit('add:player', player);
	});

	socket.on('remove:player', function (player)
	{
		socket.broadcast.to(encounterId).emit('remove:player', player);
    });

	socket.on('update:mapNotation', function(notation)
	{
		socket.broadcast.to(encounterId).emit('update:mapNotation', notation);
	});

	socket.on('add:mapNotation', function()
	{
        encounterService.addMapNotation(encounterId, userId, function(error, mapNotation)
        {
            if (error)
            {
				errorService.onError(error);
                return;
            }

            socket.broadcast.to(encounterId).emit('add:mapNotation', mapNotation);
            socket.emit('add:mapNotation', mapNotation);
        });
    });

	socket.on('remove:mapNotation', function(notation)
	{
        encounterService.removeMapNotation(encounterId, notation._id, function(error)
        {
            if (error)
            {
                errorService.onError(error);
                return;
            }

            socket.broadcast.to(encounterId).emit('remove:mapNotation', notation);
            socket.emit('remove:mapNotation', notation);
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
	{
		socket.broadcast.emit('new:campaign');
	});
};