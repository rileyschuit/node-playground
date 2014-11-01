var crypto = require('crypto');
var express = require('express');
module.exports = function(app) {
  var users = require('./controllers/users_controller');
  //
  // Public
  //
  app.use('/public', express.static( './public'));
  //
  // Admin pages
  //
  app.get('/admin/profile/modify/:id/json', users.UserModifyJSON);
  app.get('/admin/profile/modify/:id', function(req, res){
    if (req.session.username !== 'admin') {
      res.redirect('/');
      req.session.msg = 'Access denied';
    } else {
      res.render('AdminProfileModify');
    }
  });
  // TODO:  Something is broken here, on this post.
  app.post('/admin/profile/update', users.AdminUserUpdate); 
  app.get('/admin/user/create', function(req, res){
    if(req.session.username !== 'admin'){
      res.redirect('/');
      req.session.msg = 'Access denied!';
    }
    res.render('AdminUserCreate', {username: req.session.username, msg:req.session.msg});
  });
  app.post('/admin/user/create', users.UserCreate);
  app.get('/admin/user/list/json', users.UserListJSON);
  app.get('/admin/user/list', function(req, res){
    if(req.session.username !== 'admin'){
      res.redirect('/');
      req.session.msg = 'Access denied!';
    }
    res.render('AdminUserList', {username: req.session.username});
  });
  app.get('/admin/user/delete/:id', users.UserDelete);
  //
  // User Pages
  //
  app.get('/', function(req, res){
    if (req.session.user) {
      res.render('Index', {username: req.session.username,
                          msg:req.session.msg,
      });
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.get('/user/profile/json', users.getUserProfile);
  app.get('/user/profile/modify', function(req, res){
    if (req.session.user) {
      res.render('UserProfileModify', {msg:req.session.msg});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.post('/user/profile/update', users.UserUpdate);
  app.get('/user/login',  function(req, res){
    if(req.session.user){
      res.redirect('/');
    }
    res.render('UserLogin', {msg:req.session.msg});
  });
  app.post('/user/login', users.UserLogin);
  app.get('/user/logout', function(req, res){
    req.session.destroy(function(){
      res.redirect('/user/login');
    });
  });
  //
  // HTTP error codes
  //
  app.get('*', function(req, res){
    res.send('what??? (404): Page not Found', 404);
  });
};
