module.exports = (function(){

	// GET /users/:id/media?lat=<LAT>&lng=<LNG>&time=<TIME>
	return function* collection(id) {
    var Q = require('q');
    var TwitterManager = require('../media/twitter');
    var InstagramManager = require('../media/instagram');
    
    // Twitter Requests
    var twitterDef = Q.defer();
    var twitterGranuals = twitterDef.promise
                          .then(TwitterManager.search);
    
    // Instagram Requests
    var instagramDef = Q.defer();
    var instagramGranuals = instagramDef.promise
                            .then(InstagramManager.search);

    // Flickr Requests
    // var FlickrManager = require('../media/flickr');
    // var flickrGranuals = yield FlickrManager.search(this.request.url);

    // Creating a universal capsul object
    var capsul = {
      "user_id": id,
      "latitude": require('../../helpers').paramsForUrl(this.request.url).lat,
      "longitude": require('../../helpers').paramsForUrl(this.request.url).lng, 
      "timestamp": require('../../helpers').paramsForUrl(this.request.url).time,
      "data": []
    }

    twitterDef.resolve(this.request.url)
    instagramDef.resolve(this.request.url)

    capsul.data.push(twitterGranuals);
    capsul.data.push(instagramGranuals);

		this.body = yield capsul;
	}
})();