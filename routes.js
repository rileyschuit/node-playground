var crypto = require('crypto');
var express = require('express');
module.exports = function(app) {
  var users = require('./controllers/users_controller');
  app.use('/public', express.static( './public'));
  app.get('/', function(req, res){
    if (req.session.user) {
      res.render('Index', {user: req.session.username, msg:req.session.msg});
    } else {
      //req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.get('/user/profile', function(req, res){
    if (req.session.user) {
      res.render('UserProfile', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
  });
  app.get('/user/create', function(req, res){
    if(req.session.username !== "admin"){
      res.redirect('/');
    }
    res.render('UserCreate', {msg:req.session.msg});
  });
  app.get('/user/login',  function(req, res){
    if(req.session.user){
      res.redirect('/');
    }
    res.render('UserLogin', {msg:req.session.msg});
  });
  app.get('/user/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/user/login');
    });
  });
  app.get('/user/list', users.UserList);
  app.post('/user/login', users.login);
  app.post('/user/create', users.UserCreate);
  app.post('/user/update', users.UserUpdate);
  
  //TODO:  Need delete option when user list is complete
  //app.post('/user/delete', users.DeleteUser);
  //TODO:  Make pretty with render
  //app.get('/user/profile', users.UserProfile);
}
