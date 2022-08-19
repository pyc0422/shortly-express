const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // if (req.method === 'GET') {
  //   if (req.url === '/login' || req.url === '/signup') {
  //     return next();
  //   }
  // }
  if (!req.cookies) {
    req.cookies = {};
  }
  return models.Sessions.get({hash: req.cookies.shortlyid})
    .then((data) => {
      console.log('data: ', data);
      //console.log('all request body: ', req.body);
      if (!data) {
        // console.log('no data request body: ', req.body.username);
        //const { username } = req.body;
        // console.log({username});
        // return models.Users.get({ username })
        //   .then((user) => {
        //     console.log('user: ', user);
        //     var userId = user ? user.id : null;
        return models.Sessions.create()
          .then((createData)=> {
            //console.log('createData: ', createData);
            return models.Sessions.get({id: createData.insertId})
              .then((hashData) => {
                console.log('hashdata ', hashData);
                req.session = {};
                req.session.hash = hashData.hash;
                // req.session.user = hashData.userId;
                res.cookie('shortlyid', hashData.hash);
                next();
              });
          })
          .catch(err => {
            console.log('err1: ', err);
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

module.exports.verifySession = function(req, res, next) {
  // console.log(req.session);
  // if (!models.Sessions.isLoggedIn(req.session)) {
  //   res.redirect('/login');
  // } else {
  //   next();
  // }
};