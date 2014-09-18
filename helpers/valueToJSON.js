module.exports = (function() {
  return function valueToJSON(value) {
    return JSON.parse(JSON.stringify(value));
  }
})()