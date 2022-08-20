const parseCookies = (req, res, next) => {
  // console.log('start parse cookies');
  // console.log('before parse cookie: ', req.headers.cookie);
  if (!req.headers.cookie) {
    req.cookies = {};
    next();

  } else {
    var cookieStr = req.headers.cookie;
    req.cookies = {};
    var cookiesArr = cookieStr.split('; ');
    cookiesArr.forEach(cookie => {
      var arr = cookie.split('=');
      var key = arr[0];
      var value = arr[1];
      req.cookies[key] = value;
    });

    // console.log('after pase cookies: ', req.cookies);
    next();
  }

};

module.exports = parseCookies;