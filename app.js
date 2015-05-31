
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var app = express();
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
require('./models/users_model.js');
var config = require('./configuration.json');

// Seeding for development:
require('./models/user-seed.js');

app.configure(function () {
  app.set('ip', process.env.IP || config.site.ip);
  app.set('port', process.env.PORT || config.site.port);
  app.set('views', path.join(__dirname, 'views'));
  //temp for fix:
  app.engine('.html', require('ejs').__express);
  //app.set('view engine', 'jade');
  app.set('view engine', 'html');
  app.set('view options', {layout: false});
   app.use(express.urlencoded());
   app.use(express.methodOverride());
   app.use(express.cookieParser(config.site.cookiename));
   app.use(express.session({
     secret: config.secret,
     maxAge: new Date(Date.now() + 604800),
     store: new mongoStore(config.db)
   }));
});

//Connect to mongodb, refer to configuration file
var dbUrl = 'mongodb://';
dbUrl += config.db.username + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.db
mongoose.connect(dbUrl);
mongoose.connection.on('open', function () {
});

// routes
require('./routes')(app);

//TODO:  This doesn't work right, trying to check admin acount with user controller method
// Initall Application startup, check if admin exists, if not, create with admin as the password
var init = require('./controllers/users_controller.js').Initilization;
init;

// Uses site.ip, site.port to setup destination IP:Port
http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
