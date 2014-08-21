module.exports = (function(){
	
	function collectParams(url) {
		var helper = require("../../helpers");
		var params = helper.paramsForUrl(url);
		return params
	}

	function constructUrl(params) {
	  url = "http://twitter-capsul.herokuapp.com/tweets?";
	  url += "lat" + "=" + params["lat"] + "&";
	  url += "lng" + "=" + params["lng"] + "&";
	  url += "time" + "=" + params["time"];
	  return url;
	}

	function responseToJson(responseString) {
		return JSON.parse(responseString).tweets
	}

	function convertBuffer(buffer) {
		return buffer.toString('utf8')
	}

	return TwitterManager = {
		search: function (url) {
			var qHTTP = require("q-io/http");
			var params = collectParams(url);
			var url = constructUrl(params);
			
			return qHTTP.read(url)
			.then(convertBuffer, console.error)
			.then(responseToJson, console.error)
		}
	};
})();