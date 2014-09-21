var express   = require('express'),
		path 			= require('path'),
		cors      = require('cors'),
		dotenv    = require('dotenv'),
		async     = require('async'),
		request   = require('request'),
		config    = require('./config'),
		app 		  = express()

// Including CORS for cross-origin request access
app.use(cors())
app.use(config.crossDomain)

// Setting application port
app.set('port', config.server.port)

// Load local environment variables
dotenv.load()

// Include Capsul API Routes
require('./routes')(app)

// Listen on local/heroku server port
app.listen(config.server.port, function() {
	var status = 
	"Express server listening on port " + app.get('port') + 
  " in " + process.env.NODE_ENV + " environment " + "..."
  console.log(status)
})