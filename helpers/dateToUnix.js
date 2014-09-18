module.exports = (function() {
 return function dateToUnix(date) {
    var date = new Date(date)
    return date.getTime().toString().slice(0,-3)
  }
})();