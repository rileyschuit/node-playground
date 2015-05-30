var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    color: String,
    sec_question: String,
    sec_answer: String,
    hashed_password: String,
    type: String,
    status: Boolean
});

mongoose.model('User', UserSchema);

