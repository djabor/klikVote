var express = require('express')
  , routes = require('./routes')
  , Resource = require('express-resource')
  , http = require('http')
  , path = require('path')
  , sessionConnections = 0;
  global.root = process.cwd() + '/';

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.compress());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true}));
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(require('less-middleware')({ src: __dirname + '/public', compress: true, optimization: 2 }));
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('development mode');
});

app.configure('production', function(){
  app.use(express.static(path.join(__dirname, 'public')));
  console.log('production mode');
});

//VIEWS
app.get('/', routes.index);
app.get('/views/:view.html', routes.views);

//COLLECTION CONTROLLERS
var Users = require('./controllers/users')
, Votes = require('./controllers/votes')
, Voters = require('./controllers/voters');

//REST
var users = app.resource('resources/users', Users);
var votes = app.resource('votes', Votes)
users.add(votes);
var voters = app.resource('resources/voters', Voters);

var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1); 

global.io = io;
io.sockets.on('connection', function(socket){
  socket.emit('connected', {id: socket.id});
  sessionConnections++;
  console.log(sessionConnections);
  socket.on('disconnect', function(){
    sessionConnections--;
    console.log(sessionConnections);
  });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});