module.exports = (function(){
	
	function collectParams(url) {
		return require("../../helpers").paramsForUrl(url);
	}

	function constructUrl(params) {
	  url = "http://twitter-capsul.herokuapp.com/tweets?";
	  url += "lat" + "=" + params["lat"] + "&";
	  url += "lng" + "=" + params["lng"] + "&";
	  url += "time" + "=" + params["time"];
	  return url;
	}

	function tweetResponse(res) {
		return JSON.parse(res.toString('utf8')).tweets
	}

	return TwitterManager = {
		search: function (url) {
			var params = collectParams(url);
			var constructedUrl = constructUrl(params);
			return constructedUrl;
		}
	};
})();