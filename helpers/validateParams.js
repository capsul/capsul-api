module.exports = function(rawParams){

	var lat,
			lng, 
			time,
			offset
			
	// Verify we have something for each required param
	if ( !rawParams.lat || !rawParams.lng || !rawParams.time || !rawParams.utc_offset ) { return false }

	// Validate latitude
	lat = Number(rawParams.lat)
	if ( typeof lat !== "number" || lat < -90 || lat > 90 ) { return false }

	// Validate longitude
	lng = Number(rawParams.lng)
	if ( typeof lng !== "number" || lng < -180 || lng > 180 ) { return false }

	// Validate timestamp
	time = parseInt(rawParams.time)
	if ( typeof time !== "number" ) { return false }

	// Validate timestamp
	offset = parseInt(rawParams.utc_offset)
	if ( typeof offset !== "number" ) { return false }

	return true

}