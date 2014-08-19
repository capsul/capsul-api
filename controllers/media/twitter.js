module.exports = (function(){
	
var twitterRequestDef = require('q').defer();

function collectParams(url) {
		var helper = require("../../helpers");
		var params = helper.paramsForUrl(url);
		params.time = helper.unixToDate(params.time);
		return params
	}

	function createInstance(searchInfo) {
		var Twitter = require('node-twitter');
		return new Twitter.SearchClient( 
			process.env.CONSUMER_KEY, 
			process.env.CONSUMER_SECRET, 
			process.env.ACCESS_TOKEN_KEY, 
			process.env.ACCESS_TOKEN_SECRET 
		);
	}

	function locationForTweet(tweet) {
		try {
			return {
				"lat": tweet.geo.coordinates.shift(),
				"lon": tweet.geo.coordinates.shift()
			}
		} catch(e) {
			return {
				"lat": "", // TODO: Make current search coords
				"lon": ""  // TODO: Make current search coords
			}
		}
	}

	function hashtagsForTweet(tweet) {
		try {
			return tweet.entities.hashtags.map(function(hashtag) {
				return hashtag.text;
			});
		} catch(e) {
			return [];
		}
	}

	function granualFromTweet(tweet) {
		return granual = {
			type: 				"text",
			created_at: 	tweet.created_at,
			source: 			"twitter",
			language: 		tweet.lang,
			content: 			tweet.text,
			author:     	tweet.user.screen_name,
			location:   	locationForTweet(tweet),
			hashtags:   	hashtagsForTweet(tweet)
		}
	}

	function granualsFromTwitterData(twitterData) {
		return twitterData.map(function(tweet) {
			return granualFromTweet(tweet);
		});
	}

	function requestData(err, data) {
		twitterRequestDef.resolve(data.statuses);
	}

	return TwitterManager = {
		search: function *(url) {
			var params = collectParams(url);
			var Twitter = createInstance();
			
			Twitter.search( { 
				'q': '',
				'geocode': params.lat + "," + params.lng + "," + "1mi", 
				'since_id': params.time,
				'result_type': 'recent',
				'count': 100,
				'include_entities': true }, 
				requestData)

			return twitterRequestDef.promise
			.then(granualsFromTwitterData);
		}
	};
})();