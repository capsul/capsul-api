var helpers = require('../../helpers')

function constructTwitterCapsulRequest(params) {
  var url = "http://twitter-capsul.herokuapp.com/tweets?";
  url += "lat" + "=" + params["lat"] + "&"
  url += "lng" + "=" + params["lng"] + "&"
  url += "time" + "=" + params["time"]
  return url
}

module.exports = (function(){
	return function (url) {
		var params = helpers.urlParams(url)
		return constructTwitterCapsulRequest(params)
	}
})()