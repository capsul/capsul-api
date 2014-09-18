var helpers = require('../../helpers')

function constructUrl(params) {
  var url = 'http://instagram-capsul.herokuapp.com/media?' 
  url += 'lat=' + params.lat
  url += '&lng=' + params.lng
  url += '&time='+ params.time
  url += '&access_token='
  url += process.env.INSTAGRAM_ACCESS_TOKEN
  return url
}

function spawnParamTimes(params) {
  var offset = 8 * (60 * 60)

  var pastParams = helpers.valueToJSON(params)
  pastParams.time = (Number(params.time) + Number(offset)).toString()

  var futureParams = helpers.valueToJSON(params)
  futureParams.time = (Number(params.time) + Number(offset)).toString()

  return [pastParams, params, futureParams]
}

module.exports = (function(){
  return function (url) {
    var params = helpers.urlParams(url)
    return spawnParamTimes(params)
    .map(function(paramSet) {
      return constructUrl(paramSet)
    })
  }
})()