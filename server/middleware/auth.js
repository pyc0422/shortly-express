const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  return models.Sessions.get({hash: req.cookies.shortlyid})
    .then((data) => {
      if (!data) {
        return models.Sessions.create()
          .then((createData)=> {
            return models.Sessions.get({id: createData.insertId})
              .then((hashData) => {
                req.session = {};
                req.session.hash = hashData.hash;
                res.cookie('shortlyid', hashData.hash);
                next();

              });
          });
      } else {
        req.session = data;
        next();
      }
    })
    .catch(err => {
      console.log('err: ', err);
    });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

