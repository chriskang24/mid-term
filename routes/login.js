const express = require('express');
const router = express.Router();
const { getNameWithEmail, NewOrderId, getUserFromCookie } = require('../server/database');

//webpage will have normal functionality even if not logged in
//if they're not logged in, they can do everything, but pay

module.exports = (db) => {
  router.post("/", (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    console.log(req.body);
    return getNameWithEmail(email)
      .then(user => {
        if (user.password === password) {
          req.session.id = user.id;
          res.json({name: user.name});
        } else {
          res.json({result:false});
        }
      })
      .catch(err => res.json({result:false}));
  });
  return router;
};
