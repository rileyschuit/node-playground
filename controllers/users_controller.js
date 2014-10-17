var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).
         digest('base64').toString();
}
// Format of User Method Names:
// "/user/create" = UserCreate
// "/user/update" = UserUpdate
// etc...
exports.UserCreate = function(req, res){
  var user = new User({username:req.body.username});
  user.set('hashed_password', hashPW(req.body.password));
  user.set('email', req.body.email);
  user.set('sec_question', req.body.sec_question);
  user.set('sec_answer', req.body.sec_answer);
  // TODO: Add when view is updated for type
  //user.set('type', req.body.type);
  user.save(function(err) {
    if (err){
      res.session.error = err;
      res.redirect('/user/create');
    } else {
      //req.session.user = user.id;
      //req.session.username = user.username;
      //req.session.msg = 'Authenticated as ' + user.username;
      res.redirect('/user/list');
    }
  });
};
exports.login = function(req, res){
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
        res.redirect('/login');
      });
    }
  });
};
// View to update user profile
// Current issue:  User session variables are not populating
exports.UserProfile = function(req, res) {
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    user.save(function(err) {
      if (err){
        res.session.error = err;
      } else {
        req.session.msg = 'User Updated.';
      }
    });
  });
};
// Update user data 
// Curruent issue:  req.session.msg not seen
exports.UserUpdate = function(req, res){
  User.findOne({ _id: req.session.user })
  .exec(function(err, user) {
    user.set('hashed_password', hashPW(req.body.password));
    user.set('email', req.body.email);
    user.set('sec_question', req.body.sec_question);
    user.set('sec_answer', req.body.sec_answer);
    //user.set('type', req.body.type);
    user.save(function(err) {
      if (err){
        res.session.error = err;
      } else {
        req.session.msg = 'User Updated.';
      }
      res.redirect('/user/profile');
    });
  });
};
  //TODO: Test when view is created
exports.UserDelete = function(req, res){
  User.findOne({ _id: req.user })
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
exports.UserList = function(req, res) {
  User.find()
  .exec(function(err, users) {
    if (!users) {
      res.json(404, {msg: 'No Users found'})
    } else {
      res.json(users);
    }
  });
};
