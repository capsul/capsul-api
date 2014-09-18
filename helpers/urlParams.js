module.exports = (function(){
	return function paramsForUrl(query){
		 var paramInfo = {}
		 var queryContainsParams = (query.indexOf("?") !== -1) ? true : false
		if (queryContainsParams) {
		  var paramList = query.split("?")[1].split("&")
		  paramList.forEach(function(paramPair) {
		    var keyValue = paramPair.split("=")
		    paramInfo[keyValue.shift()] = keyValue.shift()
		  })
		}
	  return paramInfo
	}
})()