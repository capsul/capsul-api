module.exports = (function(){
	// POST /users
	return function create(req, res) {
		res.json({"users": "create"});
	}
})();