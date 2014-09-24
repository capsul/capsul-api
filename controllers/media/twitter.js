var parseParams = require('../../helpers/parseParams')

function constructRequest(params) {
  return 'http://twitter-capsul.herokuapp.com/tweets?' +
    'lat' + '=' + params['lat'] + '&' +
    'lng' + '=' + params['lng'] + '&' +
    'time' + '=' + params['time']
}

module.exports = function(url) {
	return constructRequest(parseParams(url))
}