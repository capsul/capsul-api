var request = require('request');
var thunk   = require('thunkify');
var co      = require('co');
var get     = thunk(request);
var _       = require('underscore');

module.exports = (function(){

  function toJSON(response) {
    return JSON.parse(response.body)
  }
  
  function dateToUnix(date) {
    var date = new Date(date);
    return date.getTime().toString().slice(0,-3);
  }

  function chronological(granuals) {
    return _.sortBy(granuals, function(granual) {
      return parseInt(granual.created_at);
    })
  }

  function convertTweetsTimeType(tweets) {
    tweets = _.sample(tweets, [50]);
    return _.map(tweets, function(tweet) {
      tweet.created_at = dateToUnix(tweet.created_at);
      return tweet;
    });
  }

  function stagger(media, tweets) {
    var staggered = [];
    mediaCount = 0;
    tweetsIndex = 0;
    
    for(var i = 0; i < media.length; i++) {
      staggered.push(media.shift());
      mediaCount++;
      if (mediaCount == 2) {
        staggered.push(tweets.shift());
        tweetsIndex++;
        mediaCount = 0;
      }
    }
    return staggered.concat(tweets)
  }

  function *collectData() {
    var twitterRes = yield get(require('../media/twitter').search(this.request.url));
    var instagramRes = yield get(require('../media/instagram').search(this.request.url));
    var tweets = convertTweetsTimeType(toJSON(twitterRes[0]).tweets)
    var media = toJSON(instagramRes[0]).media;
    tweets = chronological(tweets);
    media = chronological(media);
    var staggeredGranuals = stagger(media, tweets);
    return staggeredGranuals;
  }

	// GET /users/:id/media?lat=<LAT>&lng=<LNG>&time=<TIME>
	return function *(id) {
    var capsul = {
      user_id: id,
      latitude: require('../../helpers').paramsForUrl(this.request.url).lat,
      longitude: require('../../helpers').paramsForUrl(this.request.url).lng, 
      timestamp: require('../../helpers').paramsForUrl(this.request.url).time,
      data: yield collectData
    }
    this.body = yield capsul;
  }

})();