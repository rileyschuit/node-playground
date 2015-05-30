var mongoose = require('mongoose'),
    User= mongoose.model('User');

User.find({}).remove(function() {
	User.create({
		username: admin,
    	email: 'admin@admin.com',
    	color: 'blue',
    	sec_question: 'question',
    	sec_answer: 'answer',
    	hashed_password: 'jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=',
    	type: 'admin',
    	status: true
	})
})