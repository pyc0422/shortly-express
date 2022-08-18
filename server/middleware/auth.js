const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // if (JSON.stringify(req.cookies) === '{}') {
  //   return models.Sessions.create()
  //     .then((data)=> {
  //       return models.Sessions.get({id: data.insertId})
  //         .then((hashData) => {
  //           console.log('hashData: ', hashData.hash);
  //           if (!req.session) {
  //             req.session = {};
  //             req.session.hash = hashData.hash;
  //             res.cookie('shortlyid', hashData.hash);
  //             // console.log( 'has cookies');
  //             console.log('response cookies ', res.cookies);

  //           }
  //           next();
  //         });
  //     });
  // }
  // console.log('next test');

  // next();

  if (!req.cookies) {
    req.cookies = {};
  }
  return models.Sessions.get({hash: req.cookies.shortlyid})
    .then((data) => {
      //console.log('data: ', data);
      //console.log('all request body: ', req.body);
      if (!data) {
        console.log('no data request body: ', req.body.username);
        const { username } = req.body;
        return models.Users.get({ username })
          .then((user) => {
            console.log('user: ', user);
            var userId = user ? user.id : null;
            // console.log({userId});
            return models.Sessions.create({userId: userId})
              .then((createData)=> {
                //console.log('createData: ', createData);
                return models.Sessions.get({id: createData.insertId})
                  .then((hashData) => {
                    req.session = {};
                    req.session.hash = hashData.hash;
                    res.cookie('shortlyid', hashData.hash);
                    next();

                  });
              })
              .catch(err => {
                console.log('err1: ', err);
              });

            // return models.Sessions.create()
            //   .then((createData)=> {
            //     return models.Sessions.get({id: createData.insertId})
            //       .then((hashData) => {
            //         req.session = {};
            //         req.session.hash = hashData.hash;
            //         res.cookie('shortlyid', hashData.hash);
            //         next();

            //       });
            //   });
          });


      } else {
        console.log('has data request body: ', req.body);
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

