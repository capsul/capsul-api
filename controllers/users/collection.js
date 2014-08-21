module.exports = (function(){

	// GET /users/:id/media?lat=<LAT>&lng=<LNG>&time=<TIME>
	return function* collection(id) {

		// Twitter Requests
    var twitterDef = require('q').defer()
    var TwitterManager = require('../media/twitter');
    var twitterGranuals = twitterDef.promise.then(TwitterManager.search);
  //   var twitterDef = require('q').defer()

    // var instagramDef = require('q').defer()
    var InstagramManager = require('../media/instagram');
    // var instagramGranuals = instagramDef.promise.then(InstagramManager.search);
    var instagramGranuals = InstagramManager.search(this.request.url);
    
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

    // def.resolve(this.request.url)
    // var instaGranuals = def.promise.then(InstagramManager.search);
    // capsul.data.push(instagramGranuals)

    twitterDef.resolve(this.request.url)
    // instagramDef.resolve(this.request.url)
    
    capsul.data.push(twitterGranuals);
    capsul.data.push(instagramGranuals)

		this.body = yield capsul;
	}
})();