var crypto = require('crypto');
var express = require('express');
module.exports = function(app) {
  var users = require('./controllers/users_controller');
  app.use('/public', express.static( './public'));
  app.get('/', function(req, res){
    if (req.session.user) {
      res.render('index', {username: req.session.username,
                          msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.get('/user/profile/modify', function(req, res){
    if (req.session.user) {
      res.render('UserProfileModify', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.get('/user/create', function(req, res){
    if(req.session.username !== 'admin'){
      res.redirect('/');
      req.session.msg = 'Access denied!';
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
  app.post('/user/create', users.UserCreate);
  app.post('/user/update', users.UserUpdate);
  app.post('/user/delete', users.UserDelete);
  app.post('/user/login', users.UserLogin);
  app.get('/user/profile', users.getUserProfile);
  app.get('/user/list', users.UserList);
}
