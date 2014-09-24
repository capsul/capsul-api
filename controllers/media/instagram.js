var parseParams = require('../../helpers/parseParams')
var objectToJson = require('../../helpers/objectToJson')

function constructRequest(params) {
  return 'http://instagram-capsul.herokuapp.com/media?' +
    'lat=' + params.lat +
    '&lng=' + params.lng +
    '&time='+ params.time +
    '&access_token=' +
    process.env.INSTAGRAM_ACCESS_TOKEN
}

function spawnParamTimes(params) {
  var offset = 8 * (60 * 60)

  var pastTimeFrame = objectToJson(params)
  pastTimeFrame.time = (Number(params.time) + Number(offset)).toString()

  var futureTimeFrame = objectToJson(params)
  futureTimeFrame.time = (Number(params.time) + Number(offset)).toString()

  return [pastTimeFrame, params, futureTimeFrame]
}

module.exports = function (url) {
  var params = parseParams(url)
  var timeFrames = spawnParamTimes(params)
  return timeFrames.map(function(timeFrame) {
            return constructRequest(timeFrame)
         })
}