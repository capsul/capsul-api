module.exports = (function(){
	// PUT /users/:id
	return function update(req, res) {
		res.json({"users": "update"});
	}
})();