var request     = require('request'),
    async       = require('async'),
    dateToUnix  = require('../../helpers/dateToUnix'),
    parseParams = require('../../helpers/parseParams'),
    _           = require('underscore')

function chronological(granuals) {
  return _.sortBy(granuals, function(granual) {
    return parseInt(granual.created_at)
  })
}

function convertTweetsTimeType(tweets) {
  tweets = _.sample(tweets, [50])
  return _.map(tweets, function(tweet) {
    tweet.created_at = dateToUnix(tweet.created_at)
    return tweet
  })
}

function removeDuplicates(mediaList, attribute) {
  var seen = {}
  return mediaList.filter(function(mediaItem) {
    var key = mediaItem[''+ attribute +'']
    return seen[key] ? false : (seen[key] = true)
  });
}

function stagger(media, tweets) {
  var staggered = []
  media.forEach(function(image, index) {
    staggered.push(image)
    staggered.push(tweets.shift())
  });
  return staggered
}

function parseTweets(data) {
  return JSON.parse(data).tweets
}

function parseImages(data) {
  return JSON.parse(data).media
}

function endpointsToRequests(endpoints) {
  return endpoints.map(function(endpoint) {
    return function(callback) {
      request(endpoint, function(err, res, body) {
        if (!body) { callback(null, []) }
        callback(null, parseImages(body))
      })
    }
  })
}

function requestEndpoints(endpoints, callback) {
  endpoints = endpointsToRequests(endpoints)
  async.parallel(endpoints, 
  function(err, data) {
    if (err) { callback(err); return }
    callback(err, _.flatten(data))
  })
}

function requestEndpoint(endpoint, callback) {
  request(endpoint, function(err, res, body) {
    if (err) { callback(err); return };
    if (!body) callback(err, [])
    else callback(err, parseTweets(body));
  })
}

// GET /users/:id/media?lat=LAT&lng=LNG&time=TIME
module.exports = function (req, res) {
  var params = parseParams(req.url);

  if (!params.lat || !params.lng || !params.time) {
    res.send({'error': 'Invalid request params'})
    return
  }

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
        instagramData = removeDuplicates(instagramData, 'created_at');
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
    var tweets = chronological(convertTweetsTimeType(data.twitter));
    var media = chronological(data.instagram);
    capsul.data = tweets.length ? stagger(media, tweets) : media
    res.json(capsul);
  });
}