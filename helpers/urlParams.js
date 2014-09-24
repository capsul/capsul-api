var qs = require('querystring')

module.exports = function (query){
	// Ex. Input: "/users/1/media?lat":"37.819877","lng":"-122.47894"
	if (query.indexOf("?") === -1) { return {} }
	return qs.parse(query.split("?")[1])
}
