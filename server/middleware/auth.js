const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // console.log('session cookies: ', req.cookies);

  if (JSON.stringify(req.cookies) === '{}') {
    return models.Sessions.create()
      .then((data)=> {
        return models.Sessions.get({id: data.insertId})
          .then((hashData) => {
            console.log('hashData: ', hashData.hash);
            if (!req.session) {
              req.session = {};
              req.session.hash = hashData.hash;
              res.cookie('shortlyid', hashData.hash);
              // console.log( 'has cookies');
              console.log('response cookies ', res.cookies);
              return next();
            }
          });
      });
  }
  console.log('next test');

  next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

