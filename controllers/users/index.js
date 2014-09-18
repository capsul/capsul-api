module.exports = (function() {
	return {
		// POST /users
		create: require('./create'),

		// GET /users/:id
		user: 	require('./user'),

		// PUT /users/:id
		update: require('./update'),

		// DELETE /users/:id
		destroy: require('./destroy'),

		// GET /users/:id/media?lat=<LAT>&lng=<LNG>&time=<TIME>
		collection: require('./collection'),
	}
})();