var parseParams = require('../../helpers/parseParams')

function constructRequest(params) {

  return 'http://twitter-capsul-v2.herokuapp.com/tweets?' +
    'lat' + '=' + params['lat'] + '&' +
    'lng' + '=' + params['lng'] + '&' +
    'time' + '=' + params['time'] + '&' +
    'utc_offset' + '=' + params['utc_offset']

}

module.exports = function(url) {

	return constructRequest(parseParams(url))
	
}