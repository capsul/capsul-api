module.exports = (function(){
	// DELETE /users/:id
	return function destroy(req, res) {
		res.json({"users": "delete"});
	}
})();