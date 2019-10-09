/**
 * signup route
 * This is a route file, where all the user signup related routes are defined. These include
 * user registration, country related and unique user,mobile# checking related routes.
 * @package signup
 * @subpackage sources\services\router\signUp
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

"use strict";

import { signUp } from "../Controller/signUpController";
// var signUpController = require('../controller/signUp/signUpController');
// var log = require('../controller/log/log');
// const configData = require('../dbconfig/dbconfig').config;

/* check unique email and mobile#  */
router.post('/service/checkUnique', (req, res) => {
  signUpController.checkUnique(req, res).then(function (response) {
    res.send(response);
  })
})

/* check unique email during registration */
router.post('/service/checkInput', (req, res) => {
  signUpController.uniqueInput(req, res).then(function (response) {
    res.send(response);
  })
})

// This takes all the user information and submits for registration
router.post('/service/userRegistration', function (req, res) {
    signUp(req, res).then(function (response) {
    res.send(response);
    log.saveLog(req, response, 200).then(logres => { }).catch(err => { })
  }, (error) => {
    res.send(error);
    log.saveLog(req, error, 400).then(logres => { }).catch(err => { })
  });
})

router.get('/service/get/country', function (req, res) {
  mariadb.createConnection(configData).then(conn => {
    signUpController.indexCountry().then(function (response) {
      conn.close();
      res.send(response);
    }, (err) => {
      conn.close();
      res.send(err);
    });
  })
});

router.get('/service/get/country/:country_name', function (req, res) {
  signUpController.countryById(req, res).then((response) => {
    res.send(response);
  }, (err) => {
    res.send(err);
  });
})

/*Get currency of country which status is 1*/
router.get('/service/v1/statusCurrency', function (req, res) {
  signUpController.getStatusCurrency(req, res).then((response) => {
    res.send(response);
  }, (err) => {
    res.send(err);
  });
})

/*Get currency of country in distinct manner*/
router.get('/service/v1/currency', function (req, res) {
  signUpController.getCurrency(req, res).then((response) => {
    res.send(response);
  }, (err) => {
    res.send(err);
  });
})

/*service for getting all the logs*/
router.get('/service/v1/logs', function (req, res) {
  log.getLog(req, res).then((response) => {
    res.send(response);
  }, (error) => {
    res.send(error);
  })
})

module.exports = router;
