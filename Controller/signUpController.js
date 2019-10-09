/**
 * signUpController Controller
 * signUpController is used for the user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpController
 * @subpackage controller/signUP/signUpController
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

"use strict";

import { SignUp, Demo }  from "../Model/userModel";
import { SignupConfig } from "../utility/signUpConfig";
// var configVariable = require('../../utility/signUpConfig');
const uuidAPIKey = require('uuid-apikey');
const crypto = require('crypto');
//var mailer = require('../mailer/mail');

// this function is used to check duplicate record
export var signUp = function (request, response) {
  var User = new User(request.body);
  
	return new Promise(function (resolve) {
		var userLogin = SignupConfig.sql.insert_userLogin, roleId = 1, address_type_id = 1;
		if (_.toLower(User.SignUp.account_type) == "business") {
			userLogin = SignupConfig.sql.insert_businessLogin; roleId = 2, address_type_id = null;
		} else if (_.toLower(User.SignUp.account_type) == "sandbox") {
			userLogin = SignupConfig.sql.insert_businessLogin; roleId = 7, address_type_id = null;
		}

		var accountType = "Sandbox"
		if (_.toLower(request.body.account_type) === "personal") {
			accountType = "Personal"
		} else if (_.toLower(request.body.account_type) === "business") {
			accountType = "Business"
		}
		User.SignUp.checkDuplicateRecord(User.SignUp.contact.email, User.SignUp.contact.mobile, accountType).then(res => {
			if (_.size(res) == 0) {
				User.SignUp.saveApplicant(User).then(userRes => {
					if (_.size(userRes) > 0) {
						var data = {
							Token: jwt.sign({ email: User.SignUp.email }, process.env.PASSWORD_CONFIG),
							status: 1, message: SignupConfig.message.signUp.success,
							client_auth: jwt.sign({ email: User.SignUp.email }, process.env.PASSWORD_CONFIG1),
							member_id: process.env.CLIENT_ID,
							api_access_key: process.env.API_KEY
						}
						User.SignUp.userContact(User, userRes.connection, userRes.id).then(conRes => {
							if (_.size(conRes) > 0) {
								User.userAddress(User, userRes.connection, address_type_id, userRes.id, conRes.contactId).then(addRes => {
									if (_.size(addRes) > 0) {
										//response.send({ status: 1, result: "inserted successfully" });
										User.userLogin(User, userRes.connection, userLogin, userRes.id, roleId).then(logRes => {
											if (_.size(logRes) > 0) {
												let apiKey = uuidAPIKey.create(), memberId = crypto.randomBytes(6).toString('hex'), url = process.env.SANDBOX_URL, api_doc_url = process.env.SANDBOX_API_DOC_URL, redirect_url = process.env.SANDBOX_REDIRECT_URL
												if (_.toLower(User.account_type) === "sandbox") {
													User.userSandbox(User, userRes.connection, userRes.id, memberId, apiKey.apiKey, url, api_doc_url, redirect_url).then(sandRes => {
														if (sandRes.affectedRows > 0) {
															mailer.signupMail(request.body.email, request.body.first_name, request.body.last_name).then((resolve) => {
															}).catch((err) => { resolve({ Error: `${err}`, status: 0 }); })
															data.userInfo = {
																applicant_id: userRes.id, email: request.body.email,
																gender: request.body.gender, mobile: request.body.mobile,
																phone: request.body.phone, account_type: _.toLower(request.body.account_type), kycStatus: "PENDING",
																initialPayment: false
															}
															if (_.toLower(request.body.account_type) === "personal") {
																data.userInfo.first_name = request.body.first_name, data.userInfo.last_name = request.body.last_name,
																	data.userInfo.next_step = request.body.next_step, data.userInfo.address_line1 = request.body.address_line1,
																	data.userInfo.address_line2 = request.body.address_line2,
																	data.userInfo.phone = request.body.phone,
																	data.userInfo.city = request.body.city, data.userInfo.country_id = request.body.country_id,
																	data.userInfo.postal_code = request.body.postal_code,
																	data.userInfo.region = request.body.region, data.userInfo.town = request.body.town
															}
															User.connectionCommit(userRes.connection);
															response.send(data)
														}
													}).catch(err => {
														response.send({ status: 0, Error: `${err}` });
													})

												} else {
													mailer.signupMail(request.body.email, request.body.first_name, request.body.last_name).then((resolve) => {
													}).catch((err) => { resolve({ Error: `${err}`, status: 0 }); })
													data.userInfo = {
														applicant_id: userRes.id, email: request.body.email,
														gender: request.body.gender, mobile: request.body.mobile,
														phone: request.body.phone, account_type: _.toLower(request.body.account_type), kycStatus: "PENDING",
														initialPayment: false
													}
													if (_.toLower(request.body.account_type) === "personal") {
														data.userInfo.first_name = request.body.first_name, data.userInfo.last_name = request.body.last_name,
															data.userInfo.next_step = request.body.next_step, data.userInfo.address_line1 = request.body.address_line1,
															data.userInfo.address_line2 = request.body.address_line2,
															data.userInfo.phone = request.body.phone,
															data.userInfo.city = request.body.city, data.userInfo.country_id = request.body.country_id,
															data.userInfo.postal_code = request.body.postal_code,
															data.userInfo.region = request.body.region, data.userInfo.town = request.body.town
													}
													// userRes.connection.commit();
													// userRes.connection.close();
													User.connectionCommit(userRes.connection);
													response.send(data);
												}
											}
										}).catch(err => {
											response.send({ status: 0, Error: `${err}` });
										})
									}
								}).catch(err => {
									response.send({ status: 0, Error: `${err}` });
								})
							}
						}).catch(err => {
							response.send({ status: 0, Error: `${err}` });
						})
					} 
				}).catch(err => {
					response.send({ status: 0, Error: `${err}` });

				})
			} else {
				//	console.log(res.result);
				if (res[0].email == request.body.email && res[0].mobile == request.body.mobile) {
					response.send({ message: configVariable.message.indexCountry.emailAndMobileExist, status: 0 })
				} else if (res[0].email == request.body.email) {
					response.send({ message: configVariable.message.indexCountry.emailExist, status: 0 })
				} else {
					response.send({ message: configVariable.message.indexCountry.mobileExist, status: 0 })
				}
			}
		}).catch(err => {
			response.send({ status: 0, message: `${err}` })
		});

	});
}

//check unique email and mobile#
var checkUnique = function (request, response) {
	return new Promise(function (resolve, reject) {
		User.checkUnique(request, response).then(res => {
			resolve(res);
		}, (err) => {
			reject(err);
		})
	})
}

// this function is used to check otp is success or expired 
var uniqueInput = function (request, response) {
	return new Promise(function (resolve, reject) {
		User.uniqueInput(request, response).then(res => {
			resolve(res);
		}, (err) => {
			reject(err);
		})
	});
}


// this function is used to get list of country
var indexCountry = function () {
	return new Promise(function (resolve, reject) {
		countryModel.obj.indexCountry().then(res=>{
			resolve(JSON.stringify(_.filter(res,{status:1})));
		},(err)=>{
			reject(err);
		})
	});
}

// this function is used to get country details by Id 
var countryById = function (request, response) {
	return new Promise(function (resolve, reject) {
		getLog.getLogStatus(_.toLower(init())).then(logRes => {
			//To get the timestamp.
			getLog.getTimeStamp().then(timeStamp => {
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "country_by_id block initiated.") : "";
				let countryName = request.params.country_name ? request.params.country_name : ''
				countryModel.obj.countryById(countryName).then(result => {
					if (typeof result[0] == 'undefined' || _.size(result) == 0) {
						logger.debug(custumLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.INVALID_COUNTRY));
						resolve({ message: configVariable.message.indexCountry.inputError, status: responseStatusHandler.NOT_FOUND.CODE });
					}
					else {
						(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "country by id details fetched successfully.") : "";
						resolve(JSON.stringify(result));
					}
				}, () => {
					logger.debug(custumLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.FETCH_FAILURE));
					throw new CustomError(responseStatusHandler.NOT_FOUND.FETCH_FAILURE, responseStatusHandler.NOT_FOUND.CODE);
					//reject(err);
				}).catch(e => {
					reject(e);
				})
			})
		})
	})
}

//get currency which status is 1
var getStatusCurrency = function (request, response) {
	return new Promise((resolve, reject) => {
		getLog.getLogStatus(_.toLower(init())).then(logRes => {
			//To get the timestamp.
			getLog.getTimeStamp().then(timeStamp => {
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "currency status block initiated.") : "";
				countryModel.obj.getStatusCurrency(request, response).then(result => {
					if (typeof result[0] == 'undefined' || _.size(result) == 0) {
						logger.debug(custumLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.INVALID_CURRENCY_STATUS));
						resolve({ message: configVariable.message.indexCountry.inputError, status: responseStatusHandler.NOT_FOUND.CODE })
					}
					else {
						(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "currency status details fetched successfully.") : "";
						resolve({ message: configVariable.message.country.status_suc, currency: result, status: responseStatusHandler.SUCCESS.CODE });
					}
				}, () => {
					logger.debug(custumLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.FETCH_FAILURE));
					throw new CustomError(responseStatusHandler.NOT_FOUND.FETCH_FAILURE, responseStatusHandler.NOT_FOUND.CODE);
				}).catch(e => {
					reject(e);
				})
			})
		})
	})
}
//This method is to get the currency by distint manner
var getCurrency = function (request, response) {
	return new Promise((resolve, reject) => {
		getLog.getLogStatus(_.toLower(init())).then(logRes => {
			//To get the timestamp.
			getLog.getTimeStamp().then(timeStamp => {
				(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "currency block initiated.") : "";
				countryModel.obj.getCurrency(request, response).then(result => {
					if (typeof result[0] == 'undefined' || _.size(result) == 0) {
						logger.debug(custumLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.INVALID_CURRENCIES));
						resolve({ message: configVariable.message.indexCountry.inputError, status: responseStatusHandler.NOT_FOUND.CODE })
					}
					else {
						(logRes.status) ? logger.info(timeStamp.val + " : " + init() + " : " + "currency details fetched succssfully.") : "";
						resolve({ message: configVariable.message.country.status_suc, currency: result, status: responseStatusHandler.SUCCESS.CODE });
					}
				}, () => {
					logger.debug(custumLogger(responseStatusHandler.NOT_FOUND.CODE, responseStatusHandler.NOT_FOUND.FETCH_FAILURE));
					throw new CustomError(responseStatusHandler.NOT_FOUND.FETCH_FAILURE, responseStatusHandler.NOT_FOUND.CODE);
				}).catch(e => {
					reject(e);
				})
			})
		})
	})
}

module.exports = {
	signUp,
	checkUnique,
	indexCountry,
	countryById,
	uniqueInput,
	getStatusCurrency,
	getCurrency
}