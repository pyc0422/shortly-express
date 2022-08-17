const parseCookies = (req, res, next) => {
  var cookieStr = req.headers.cookie;
  if (!cookieStr) {
    return next();
  }
  var cookiesArr = cookieStr.split('; ');
  cookiesArr.forEach(cookie => {
    var arr = cookie.split('=');
    var key = arr[0];
    var value = arr[1];
    req.cookies[key] = value;
  });
  next();
};

module.exports = parseCookies;