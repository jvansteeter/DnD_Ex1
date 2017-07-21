var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var busboy = require('express-busboy');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// setup mongo database
var mongoose = require('mongoose');
var database = mongoose.connect('mongodb://localhost/dnd');

// setup passport
var configAuth = require('./config/auth.js');
app.use(session({secret: configAuth.session.secret, 
                 resave: true,
                 saveUninitialized: true 
               }));
app.use(passport.initialize());
app.use(passport.session());

// setup models and configurations
require('./models/user');
require('./models/encounter');
require('./models/encounterPlayer');
require('./models/character');
require('./models/npc');
require('./models/campaign');
require('./models/campaignPost');
require('./models/campaignUser');
require('./models/mapNotatation');
require('./config/passport');

// setup routes
var indexRouter = require("./routes/index");
var authRouter = require("./routes/authorizationRouter");
// var api = require('./routes/api');
var etc = require('./routes/etcAPI');
var image = require('./routes/imageAPI');
var npc = require('./routes/npcAPI');
var campaign = require('./routes/campaignAPI');
var character = require('./routes/characterAPI');
var encounter = require('./routes/encounterAPI');
var user = require('./routes/userAPI');

// uncomment after placing your favicon in /client
app.use(favicon('client/image/favicon.ico'));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
busboy.extend(app, {
    upload: true,
    path: '/upload',
    allowedPath: /./
});

// Routes
app.use('/', indexRouter);
app.use('/login.php', function()
{
    process.exit(1);
});
app.use('/login', express.static('views/login.html'));
app.use('/profile', isLoggedIn, express.static('views/profile.html'));
app.use('/editCharacter', isLoggedIn, express.static('views/editCharacter.html'));
app.use('/editNPC', isLoggedIn, express.static('views/editNPC.html'));
app.use('/encounter', isLoggedIn, express.static('views/encounter.html'));
app.use('/home', isLoggedIn, express.static('views/home.html'));
app.use('/newCharacter', isLoggedIn, express.static('views/newCharacter.html'));
app.use('/newNPC', isLoggedIn, express.static('views/newNPC.html'));
app.use('/campaign', isLoggedIn, express.static('views/campaign.html'));
app.use('/campaignList', isLoggedIn, express.static('views/campaignList.html'));
app.use('/auth', authRouter);
app.use('/api', isAuthenticated, etc);
app.use('/api/image', isAuthenticated, image);
app.use('/api/npc', isAuthenticated, npc);
app.use('/api/campaign', isAuthenticated, campaign);
app.use('/api/character', isAuthenticated, character);
app.use('/api/encounter', isAuthenticated, encounter);
app.use('/api/user', isAuthenticated, user);

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') 
{
    app.use(function(error, req, res)
    {
        console.log("---!!! An error has occurred !!!---");
        console.error(error);
        res.status(error.status || 500);
        res.render('error', 
        {
            message: error.message,
            error: error
        });
    });
}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next)
// {
//     console.log('---!!! non dev error has occurred !!!---');
//     res.status(err.status || 500);
//     res.render('error',
//     {
//         message: err.message,
//         error: {}
//     });
// });

// catch any other uncaughtException
process.on('uncaughtException', function(error)
{
    console.log("Uncaught error exception");
    console.error(error.stack)
});

function isLoggedIn(req, res, next)
{
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
    {
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/login');
}

function isAuthenticated(req, res, next)
{
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
    {
        return next();
    }
    // if they aren't redirect them to the home page
    res.sendStatus(401);
}

module.exports = app;
