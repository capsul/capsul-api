module.exports = (function(){
	
	return function unixToDate(unixTime) {
		console.log(unixTime)
		var date = new Date(Number(unixTime));
		var year = date.getFullYear();
		var month;
		var day;

		if (date.getMonth().toString().length === 1) {
			month = "0" + (date.getMonth() + 1).toString();
		} else {
			month = (date.getMonth() + 1).toString();
		}
		
		if (date.getDate().toString().length === 1) {
			day = "0" + date.getDay().toString();
		} else {
			day = date.getDate().toString();
		}

		return year + '-' + month + '-' + day;
	}
})();