var request         = require('request'),
    async           = require('async'),
    dateToUnix      = require('../../helpers/dateToUnix'),
    parseParams     = require('../../helpers/parseParams'),
    validateParams  = require('../../helpers/validateParams'),
    _               = require('underscore'),
    moment          = require('moment');

function chronological(granules) {
  return _.sortBy(granules, function(granule) {
    return parseInt(granule.created_at)
  })
}

function timestampToTimeString(tweets, utcOffset) {
  return _.map(tweets, function(tweet) {
    var regularizedTimeString = moment(Number(tweet.created_at)*1000).zone(-Number(utcOffset) / 60).format("ddd, MMM Do YYYY, h:mm:ss a [GMT] Z")
    tweet.created_at = regularizedTimeString
    return tweet
  })
}

function parseTweets(data) {
  return JSON.parse(data).tweets
}

function parseInstagrams(data) {
  return JSON.parse(data).media
}

function requestInstagramEndpoint(endpoint, callback) {
  request(endpoint, function(err, res, body) {
    if (err) { callback(err); return };
    if (res.statusCode == 200 && body) {
      callback(err, parseInstagrams(body));
    } else callback(err); 
  })
}

function requestTwitterEndpoint(endpoint, callback) {
  request(endpoint, function(err, res, body) {
    if (err) { callback(err); return };
    if (res.statusCode == 200 && body) {
      callback(err, parseTweets(body));
    } else callback(err); 
  })
}

// GET /users/:id/media?lat=LAT&lng=LNG&time=TIME
module.exports = function (req, res) {

  var params = parseParams(req.url);

  // replaced inline conditional with validateParams to cover
  // additional types of bad requests from client (e.g. time=Nan)
  if (!validateParams(params)) {
    res.send({'error': 'Invalid request params'})
    return
  }

  var capsul = {
    user_id: req.params.id,
    latitude: params.lat,
    longitude: params.lng, 
    timestamp: params.time,
    utcOffset: params.utc_offset,
    data: []
  }
  
  async.parallel({
    instagram: function(callback) {
      var endpoint = require('../media/instagram')(req.url);
      requestInstagramEndpoint(endpoint, function(err, instagramData) {
        if (err) return [];
        callback(null, instagramData)
      });
    },
    twitter: function(callback) {
      var endpoint = require('../media/twitter')(req.url)
      requestTwitterEndpoint(endpoint, function(err, twitterData) {
        if (err) return [];
        callback(null, twitterData)
      });
    }
  }, 
  
  function(err, data) {

    var tweets, media

    // cause the world is risky:
    if (typeof data.twitter === "undefined" || data.twitter.length === 0) {
      tweets = []
    } else {
      // limit what we send to the client since there are always too many tweets
      tweets = _.sample(data.twitter, [90])
    }
    if (typeof data.instagram === "undefined" || data.instagram.length === 0) {
      media = []
    } else {
      media = data.instagram
    }

    // concatenate tweets and instagrams and sort them by created_at timestamp
    sortedTweetsAndMedia = chronological(tweets.concat(media))

    // change created_at from timestamp to parsed strings and assign to capsul object
    capsul.data = timestampToTimeString(sortedTweetsAndMedia, params.utc_offset)

    res.json(capsul);

  });
}