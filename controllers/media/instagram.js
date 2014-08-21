module.exports = (function(){

  function collectParams(url) {
    return require("../../helpers").paramsForUrl(url);
  }

  function constructUrl(params) {
    return url = 'http://instagram-capsul.herokuapp.com/media?' + 
      'lat=' + params.lat +
      '&lng=' + params.lng +
      '&time='+ params.time +
      '&access_token=' + 
      process.env.INSTAGRAM_ACCESS_TOKEN
  }

  function spawnParamTimes(params) {
    var offset = 8 * (60 * 60)

    var pastParams  = JSON.parse(JSON.stringify(params));
    pastParams.time = (Number(params.time) + Number(offset)).toString();

    var futureParams  = JSON.parse(JSON.stringify(params));
    futureParams.time = (Number(params.time) + Number(offset)).toString();
    console.log([pastParams, params, futureParams])
    return [pastParams, params, futureParams];
  }

  function mediaResponse(res) {
    return JSON.parse(res.toString('utf8')).media
  }

  return InstagramManager = {
    search: function (url) {
      var qHTTP = require("q-io/http");
      var params = collectParams(url);
      var requestUrl = constructUrl(params);

      return qHTTP.read(requestUrl)
      .then(mediaResponse, console.error)
    }
  };
})();	