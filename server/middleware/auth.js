const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {


  if (req.cookies.shortlyid) {
    return models.Sessions.get({hash: req.cookies.shortlyid})
      .then(data => {
        if (data) {
          req.session = data;
          next();
        } else {
          return models.Sessions.create()
            .then(createData => {
              return models.Sessions.get({id: createData.insertId});
            })
            .then(hashData => {
              res.cookie('shortlyid', hashData.hash);
              req.session = hashData;
              next();
            });
        }
      });
  } else {
    return models.Sessions.create()
      .then(createData => {
        return models.Sessions.get({id: createData.insertId});
      })
      .then(hashData => {
        res.cookie('shortlyid', hashData.hash);
        req.session = hashData;
        next();
      });
  }

  // console.log('start create session');
  // console.log('req.cookies: ', req.cookies);
  // //if no shortly id throw to create session, if has do session get (hash: ), if not match create session, else req.session = data;
  // if (!Object.keys(req.cookies).length) {
  //   //create initial session
  //   models.Sessions.create()
  //     .then((createData) => {
  //       console.log(createData);
  //       return models.Sessions.get({id: createData.insertId});
  //     })
  //     .tap((hashData) => {
  //       console.log('hashData: ', hashData);
  //       console.log('req.session: ', req.session);
  //       //req.session = {};
  //       req.session = hashData;
  //       res.cookie('shortlyid', hashData.hash);
  //     })
  //     .then(() => {
  //       return models.Users.get({username: req.body.username});
  //     })
  //     .then((user) => {
  //       if (user) {
  //         req.session.userId = user.id;
  //       }
  //       next();
  //     })
  //     .catch(err => { console.log('createsession: ', err); });
  // } else {
  //   models.Sessions.get({hash: req.cookies.shortlyid})
  //     .then((data) => {
  //       console.log('return data: ', data);
  //       if (!data) {
  //         models.Sessions.create()
  //           .then((createData) => {
  //             console.log(createData);
  //             return models.Sessions.get({id: createData.insertId});
  //           })
  //           .then((hashData) => {
  //             console.log('hashData: ', hashData);
  //             console.log('req.session: ', req.session);
  //             //req.session = {};
  //             //req.session.hash = hashData.hash;
  //             req.session = hashData;
  //             res.cookie('shortlyid', hashData.hash);
  //             next();
  //           });
  //         // .then(() => {
  //         //   return models.Users.get({username: req.body.username})
  //         //     .then((user) => {
  //         //       if (user) {
  //         //         req.session.userId = user.id;
  //         //       }
  //         //       next();
  //         //     });
  //         // })

  //       } else {
  //         req.session = data;
  //         res.cookie('shortlyId', req.session.hash);

  //         models.Users.get({username: req.body.username})
  //           .then((user) => {
  //             console.log('user: ', user);
  //             req.session.userId = user.id;
  //             req.session.username = user.username;
  //             next();
  //           });
  //       }
  //     });

  // }
  // return models.Sessions.get({hash: req.cookies.shortlyid})
  //   .then((data) => {
  //     console.log('data: ', data);
  //     //console.log('all request body: ', req.body);
  //     //if no data insert data to session table
  //     if (!data) {
  //       const {username} = req.body;
  //       return models.Users.get({username})
  //         .then((user) => {
  //           var userId = !user ? null : user.id;
  //           return models.Sessions.create({userId})
  //             .then((createData)=> {
  //               //console.log('createData: ', createData);

  //               return models.Sessions.get({id: createData.insertId})
  //                 .then((hashData) => {
  //                   req.session = {};
  //                   req.session.hash = hashData.hash;
  //                   res.cookie('shortlyid', hashData.hash);
  //                   console.log('created going to next step');
  //                   next();

  //                 });
  //             });
  //         })
  //         .catch(err => {
  //           console.log('err1: ', err);
  //         });
  //     } else {
  //       console.log('has data request body: ', req.body);
  //       req.session = data;
  //       console.log('already has going to next step');
  //       next();
  //     }
  //   })
  //   .catch(err => {
  //     console.log('err: ', err);
  //   });
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.verifySession = function(req, res, next) {
  console.log('req.session: ', req.session);
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};