//TODO:  Upon initilization, check for admin user, if null, then create user
//TODO:  Still need to test:
//var config = require('../configuration.json');
var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://localhost/' + config.site.db);
require('./users_model.js');
var User = mongoose.model('./users_model.js');
function addUser(user, password, email, sec_question, sec_answer){
  var user_details = new User({name:'', hashed_password:'', email:'', sec_question: '', sec_answer: '', status: 1});
  user.save(function(err, results){
    user.push(new enabled-user({status: 1}));
    console.log("User " + user + " Saved.");
  });
}
// Initial admin account
if (User.findOne({ username : 'admin' }) == false ) {
  console.log('no admin account, creating with admin as the password');
  //addUser.save(function(err, result) {
  //var user_details = new User({name:'admin', password:'admin', email:'', sec_question: 'defaults', sec_answer: 'defaults', status: 1});
  //}); 
} else {
  console.log('admin account exists, continuing on..');
};
