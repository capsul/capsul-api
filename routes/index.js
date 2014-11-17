// API Resource controller referenecs
var controller = require('../controllers');
var capsul = controller.capsul;
var users = controller.users;

module.exports = function(app) {


	
	// Capsule
	app.get('/', capsul.home);

	// User Routes 
	app.get('/users/:id', users.user);
	app.post('/users', users.create);
	app.put('/users/:id', users.update);
	app.delete('/users/:id', users.destroy);
	app.get('/users/:id/media', users.collection);
}