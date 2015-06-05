
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var app = express();
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(express);
var mongoose = require('mongoose');
var config = require('./configuration.json');

// Models
require('./server/models/users_model.js');

// Seeding for development, TODO:  Mange this with grunt or gulp:
require('./server/models/user-seed.js');

//
app.configure(function () {
  app.set('ip', process.env.IP || config.site.ip);
  app.set('port', process.env.PORT || config.site.port);
  //app.set('views', path.join(__dirname, 'views'));
  //temp for fix:
  app.engine('.html', require('ejs').__express);
  //app.set('view engine', 'ejs')
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
var dbUrl = 'mongodb://' + config.db.username + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.db
mongoose.connect(dbUrl);
mongoose.connection.on('open', function () {
});

// routes
require('./routes')(app);

// Uses site.ip, site.port to setup destination IP:Port
http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
