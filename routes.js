var crypto = require('crypto');
var express = require('express');
module.exports = function(app) {
  var users = require('./controllers/users_controller');
  //
  // Public TODO:  Start using bower
  //
  app.use('/public', express.static( './public'));
  //
  // Admin pages
  //
  app.get('/admin/profile/modify/:id', function(req, res){
    if (req.session.username !== 'admin') {
      res.redirect('/');
      req.session.msg = 'Access denied';
    } else {
      res.render('AdminProfileModify', { title: 'Playgound' });
    }
  });
  app.put('/admin/profile/update', users.AdminUserUpdate); 
  app.get('/admin/user/create', function(req, res) {
    
    //res.render('AdminUserCreate', {username: req.session.username, msg:req.session.msg});
    if(req.session.username !== 'admin') { 
      res.redirect('/');
      req.session.msg = 'Access denied!  You must be an Admin user to create an account';
    }
    res.render('AdminUserCreate', {username: req.session.username, msg:req.session.msg, title: 'Playgound'});
  });
  app.post('/admin/user/create', users.UserCreate);
  app.get('/admin/user/list', function(req, res){
    if(req.session.username !== 'admin'){
      res.redirect('/');
      req.session.msg = 'Access denied!';
    }
    res.render('AdminUserList', {username: req.session.username, title: 'Playgound'});
  });
  app.get('/admin/user/delete/:id', users.UserDelete);
  //
  // User Pages
  //
  app.get('/', function(req, res){
    if (req.session.user) {
      res.render('Index', {username: req.session.username, msg:req.session.msg, title: 'Playgound' });
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.get('/user/profile/modify', function(req, res) {
    if (req.session.user) {
      res.render('UserProfileModify', {username: req.session.username, msg:req.session.msg, title: 'Playgound'});
    } else {
      req.session.msg = 'Access denied!';
      res.redirect('/user/login');
    }
  });
  app.put('/user/profile/update', users.UserUpdate);
  app.get('/user/login',  function(req, res){
    if(req.session.user){
      res.redirect('/');
    }
    res.render('UserLogin', {username: req.session.username, msg:req.session.msg, title: 'Playgound'});
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
  //app.get('*', function(req, res){
  //  res.send('what??? (404): Page not Found', 404);
  //});
// TODO:  Resort, make this simpler to read...
  app.get('/admin/user/list/json', users.UserListJSON);
  app.get('/admin/user/:id/json', users.getUserJSON);
  app.post('/admin/user/update', users.UserModifyJSON);

  app.get('/user/profile/:id/json', users.getUserProfile);
  app.post('/user/profile/json', users.UserUpdate);
};


