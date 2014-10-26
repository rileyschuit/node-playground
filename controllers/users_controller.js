var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}
// User Creation
exports.UserCreate = function(req, res){
  var user = new User({username:req.body.username});
  user.set('hashed_password', hashPW(req.body.password));
  user.set('email', req.body.email);
  user.set('sec_question', req.body.sec_question);
  user.set('sec_answer', req.body.sec_answer);
  user.save(function(err) {
    if (err){
      res.session.error = err;
      res.redirect('/user/create');
    } else {
      //TODO:  Add logic to check configuration file for user regirstration
      //req.session.user = user.id;
      //req.session.username = user.username;
      //req.session.msg = 'Authenticated as ' + user.username;
      res.redirect('/user/list');
    }
  });
};
// User Login
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
    }else{
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
// View to update user profile
exports.getUserProfile = function(req, res) {
  // TODO:  Modify views to include ID in request and populate the form
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    if (!user){
      res.json(404, {err: 'User Not Found.'});
    } else {
      res.json(user);
    }
  });
};
// Update user data.
exports.UserUpdate = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    user.set('email', req.body.email);
    user.set('color', req.body.color);
    user.set('sec_question', req.body.sec_question);
    user.set('sec_answer', req.body.sec_answer);
    user.save(function(err) {
      if (err){
        res.sessor.error = err;
      } else {
        req.session.msg = 'User Updated.';
      }
      res.redirect('/user/profile/modify');
    });
  });
};
//TODO: Test when view is created
exports.UserDelete = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    if(user){
      user.remove(function(err){
        if (err){
          req.session.msg = err;
        }
        req.session.destroy(function(){
          res.redirect('/login');
        });
      });
    } else{
      req.session.msg = "User Not Found!";
      req.session.destroy(function(){
        res.redirect('/login');
      });
    }
  });
};
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

