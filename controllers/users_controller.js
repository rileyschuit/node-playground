var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}
// Public - User Login
exports.UserLogin = function(req, res){
  User.findOne({ username: req.body.username })
  .exec(function(err, user) {
    if (!user){
      err = 'User Not Found.';
    } else if (user.hashed_password === 
               hashPW(req.body.password.toString())) {
      req.session.regenerate(function(){
        req.session.user = user.id;
        req.session.username = user.username;
        req.session.msg = 'Authenticated as ' + user.username;
        res.redirect('/');
      });
    } else {
      err = 'Authentication failed.';
    }
    if(err){
      req.session.regenerate(function(){
        req.session.msg = err;
        res.redirect('/user/login');
      });
    }
  });
};
/*
  ------------------ ADMIN ----------------------   
*/

// Admin - User Creation
exports.UserCreate = function(req, res){
  var user = new User({username: req.body.username});
  user.set('hashed_password', hashPW(req.body.password));
  user.set('email', req.body.email);
  user.set('sec_question', req.body.sec_question);
  user.set('sec_answer', req.body.sec_answer);
  user.save(function(err) {
    if (err){
      res.session.error = err;
      res.redirect('/admin/user/create');
    } else {
      res.redirect('/admin/user/list');
    }
  });
};
// Admin - Delete User
exports.UserDelete = function(req, res){
  User.findOne({ username: req.params.id })
  .exec(function(err, username) {
    if(username){
      username.remove(function(err){
        if (err) {
          req.session.msg = err;
        } res.redirect('/admin/user/list');
      });
    }
  });
};
// Admin - JSON data of User list and user details from user collection 
exports.UserListJSON = function(req, res) {
  User.find()
  .exec(function(err, users) {
    if (!users) {
      res.json(404, {msg: 'No Users found'})
    } else {
      res.json(users);
    };
  });
};

// Admin - update user modification
exports.AdminUserUpdate = function(req, res) {
  User.findOne({ username: req.body.username })
  .exec(function(err, user) {
    user.set('email', req.body.email);
    user.set('sec_question', req.body.sec_question);
    user.set('sec_answer', req.body.sec_answer);
    user.save(function(err) {
      if (err){
        res.session.error = err;
      } else {
        req.session.msg = 'User Updated.';
      }
      res.redirect('/');
    });
  });
};
// Admin - Get specific user data
exports.getUserJSON = function(req, res) {
  User.findOne({ username: req.params.id})
  .exec(function(err, user) {
    if (!user){
      res.json(404, {err: 'User Not Found.'});
    } else {
      res.json(user);
    }
  });
};
/*
-------------------- USER --------------------
*/
// User - JSON profile data
exports.getUserProfile = function(req, res) {
  User.findOne({ username: req.params.id})
  .exec(function(err, user) {
    if (!user){
      res.json(404, {err: 'User Not Found.'});
    } else {
      res.json(user);
    }
  });
};
// User - update user details
exports.UserUpdate = function(req, res){
  User.findOne({ username: req.session.username })
  .exec(function(err, user) {
    user.set('email', req.body.email);
    user.set('sec_question', req.body.sec_question);
    user.set('sec_answer', req.body.sec_answer);
    user.save(function(err) {
      if (err){
        res.session.error = err;
      } else {
        req.session.msg = 'User Updated.';
      }
      res.redirect('/');
    });
  });
};
