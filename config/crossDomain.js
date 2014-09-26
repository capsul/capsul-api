// Potential fix for CORS API request issues

module.exports = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    console.log('hit options')
    res.send(200)
  }
  else {
    next()
  }
}