var request = require('request'),
    async   = require('async'),
    helpers = require('../../helpers'),
    _       = require('underscore');

function chronological(granuals) {
  return _.sortBy(granuals, function(granual) {
    return parseInt(granual.created_at);
  })
}

function convertTweetsTimeType(tweets) {
  tweets = _.sample(tweets, [50]);
  return _.map(tweets, function(tweet) {
    tweet.created_at = helpers.dateToUnix(tweet.created_at);
    return tweet;
  })
}

function stagger(media, tweets) {
  var staggered = [];
  media.forEach(function(image, index) {
    staggered.push(image);
    if ((index % 2) === 1)
      staggered.push(tweets.shift());
  });

  return staggered.concat(tweets);
}

function requestEndpoints(endpoints, callback) {
  async.parallel({
    first: function(callback) {
      request(endpoints[0], function(err, res, body) {
        callback(null, helpers.toJSON(body).media);
      });
    },
    second: function(callback) {
      request(endpoints[1], function(err, res, body) {
        callback(null, helpers.toJSON(body).media);
      });
    },
    third: function(callback) {
      request(endpoints[2], function(err, res, body) {
        callback(null, helpers.toJSON(body).media);
      });
    }
  }, function(err, data) {
    if (err) { callback(err); return };
    callback(err, 
      data.first
      .concat(data.second, data.third));
  })
}

function requestEndpoint(endpoint, callback) {
  request(endpoint, function(err, res, body) {
    if (err) { callback(err); return };
    callback(err, helpers.toJSON(body).tweets);
  });
}

module.exports = (function(){
	// GET /users/:id/media?lat=LAT&lng=LNG&time=TIME
	return function collection(req, res) {
    var params = helpers.urlParams(req.url);
    var capsul = {
      user_id: req.params.id,
      latitude: params.lat,
      longitude: params.lng, 
      timestamp: params.time,
      data: []
    }
    
    async.parallel({
      instagram: function(callback) {
        var endpoints = require('../media/instagram')(req.url);
        requestEndpoints(endpoints, function(err, instagramData) {
          callback(null, instagramData)
        })
      },
      twitter: function(callback) {
        var endpoint = require('../media/twitter')(req.url)
        requestEndpoint(endpoint, function(err, twitterData) {
          callback(null, twitterData)
        });
      }
    }, 
    function(err, data) {
      console.log(data);
      var tweets = chronological(convertTweetsTimeType(data.twitter));
      var media = chronological(data.instagram);
      var staggeredGranuals = stagger(media, tweets);
      capsul.data = staggeredGranuals;

      res.json(capsul);
    });
  }
})()