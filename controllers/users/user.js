module.exports = (function(){
	// GET /users/:id
	return function user(req, res) {
		res.json({"users": "user"});
	}
})();