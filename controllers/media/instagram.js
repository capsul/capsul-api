module.exports = (function(){
	function collectParamsFromUrl(url) {
		return require("../../helpers")
		.paramsForUrl(url);
	}

	function collectOptions(params) {
		return options = {
			url: 'https://api.instagram.com/v1/media/search?' + 
			'lat=' + params.lat +
			'&lng=' + params.lng +
			'&max_timestamp='+ params.time +
			'&distance=' + '200' +
			'&access_token=' + 
			process.env.INSTAGRAM_ACCESS_TOKEN,
			headers: { 'User-Agent': 'request' }
		}
	}

	function locationForImage(image) {
		return {
			"latitude": image.location.latitude,
			"longitude": image.location.longitude
		}
	}

	function imagesForImage(image) {
		return {
			"thumb": image.images.thumbnail.url,
			"low_res": image.images.low_resolution.url,
			"high_res": image.images.standard_resolution.url
		}
	}

	function captionForImage(image) {
		try {
			return image.caption.text
		} catch(e) {
			return ""
		}
	}

	function granularFromImage(image) {
		return granular = {
			type: 			image.type,
			created_at: image.created_at,
			source: 		'instagram',
			link:       image.link,
			author:     image.user.username,
			location:   locationForImage(image),
			images:     imagesForImage(image),
			caption:    captionForImage(image),
			hashtags:   image.tags
		}
	}

	function granualsFromInstagramData(instagramData) {
		return instagramData.map(function(image) {
			return granularFromImage(image);
		});
	}

	return InstagramManager = {
		search: function *(url) {
			var params = collectParamsFromUrl(url);
			var options = collectOptions(params);

			var response = yield require('koa-request')(options);
			var response2 = yield require('koa-request')(options);
			var response3 = yield require('koa-request')(options);

			var instagramData = JSON.parse(response.body).data
			var instagramData2 = JSON.parse(response2.body).data
			var instagramData3 = JSON.parse(response3.body).data
			var combinedResponse = instagramData.concat(instagramData2)
															.concat(instagramData3)


			return granualsFromInstagramData(combinedResponse);
		}
	}
})();	