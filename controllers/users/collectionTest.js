module.exports = (function(){

	// GET /users/:id/media?lat=<LAT>&lng=<LNG>&time=<TIME>
	return function* collection(id) {

		// // Twitter Requests
		// var TwitterManager = require('../media/twitter');
		// var twitterGranuals = yield TwitterManager.search(this.request.url)

		// // Flickr Requests
		// var FlickrManager = require('../media/flickr');
		// var flickrGranuals = yield FlickrManager.search(this.request.url);

		// Instagram Requests
		var InstagramManager = require('../media/instagram');
		var instagramGranuals = yield InstagramManager.search(this.request.url)

    // Creating a universal capsul object
    var capsul = {
      "user_id": id,
      "latitude": require('../../helpers').paramsForUrl(this.request.url).lat,
      "longitude": require('../../helpers').paramsForUrl(this.request.url).lng, 
      "timestamp": require('../../helpers').paramsForUrl(this.request.url).time,
      "data": []
    }

    function addGranuals(granualCollection) {
    	granualCollection.forEach(function(granual) {
    		capsul.data.push(granual);
    	});
    }

    // Joining all source granuals
    addGranuals(instagramGranuals);
    // addGranuals(twitterGranuals);
    // addGranuals(flickrGranuals);

		this.body = yield capsul;
	}
})();