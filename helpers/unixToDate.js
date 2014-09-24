module.exports = function(unixTime) {
	var date = new Date(Number(unixTime))
	var year = date.getFullYear()
	var month = constructMonth(date)
	var day = constructDay(date)

	return year + '-' + month + '-' + day
}

function constructMonth(date) {
	var month = (date.getMonth() + 1).toString()
	return padFormatting(month)
}

function constructDay(date) {
	var day = date.getDate().toString()
	return padFormatting(day)
}

function padFormatting(value) {
	return (value.length === 1) ? '0' + value : value
}
