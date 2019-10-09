/**
 * signUpModel Model
 * signUpModel is used for the modeling of user registration purpose. An individual user has to give the required 
 * data to register himself in the payvoo app.
 * @package signUpModel
 * @subpackage sources/services/model/signUpModel
 * @author SEPA Cyper Technologies, Sekhara Suman Sahu.
 */

"use strict";

import { getDbConn } from "../dbConfig/dbconfig";
import { SignupConfig } from "../utility/signUpConfig";

export class SignUp {
    constructor(user){
        this.applicant = {
            "account_type" : user.account_type,
            "next_step" : user.next_step
        }
        this.contact = {
            "first_name" : user.first_name,
            "middle_name" : user.middle_name,
            "last_name" : user.last_name,
            "email" : user.email,
            "gender" : user.gender,
            "dob" : user.dob,
            "telephone": user.telephone,
            "mobile" : user.mobile,
            "phone" : user.phone
        }
        this.address = {
            "postal_code" : user.postal_code,
            "address_line1" : user.address_line1,
            "address_line2" : user.address_line2,
            "city" : user.city,
            "town" : user.town,
            "region" : user.region
        }
        this.saveUserLogin = {
            "passcode_pin" : user.passcode_pin,
            "role_id" : user.role_id,
            "email_verified" : user.email_verified,
            "mobile_verified" : user.mobile_verified
        }
    }

    //To store User data in applicant table
    saveApplicant(account_type, next_step){
        return new Promise((resolve, reject)=>{
            getDbConn.then(conn=>{
                conn.query(SignupConfig.sql.insert_applicant,[
                    account_type, next_step
                  ]).then(applicantRes=>{
                    resolve(applicantRes);
                  }).catch(err=>{
                    reject(err);
                  });
            }).catch(err=>{
                reject(err);
            })
        })
    }

    //To store User data in contact table
    saveContact(applicantId, contact){
      return new Promise((resolve, reject)=>{
        getDbConn.then(conn=>{
            conn.query(SignupConfig.sql.insert_contact,[
                applicantId,contact.first_name, contact.middle_name, contact.last_name, contact.email, contact.gender,
                contact.dob, contact.telephone, contact.mobile, contact.phone]
              ).then(contactRes=>{
                resolve(contactRes);
              }).catch(err=>{
                reject(err);
              });
        }).catch(err=>{
            reject(err);
        }) 
      })
    }

    //To store User data in address table  
    saveAddress(applicant_id,contact_id,address){
      return new Promise((resolve, reject)=>{
        getDbConn.then(conn=>{
            conn.query(SignupConfig.sql.insert_address,[
                address.country_id,address.address_type_id,address.postal_code,
                address.address_line1,address.address_line2,applicant_id,address.city,
                address.town,address.region,contact_id
              ]).then(addressRes=>{
                resolve(addressRes);
              }).catch(err=>{
                reject(err);
              });
        }).catch(err=>{
            reject(err);
        })
      })
    }

    //to store User data in login table
    saveLogin(userLogin, roleId,applicant_id, user){
      return new Promise((resolve, reject)=>{
        getDbConn.then(conn=>{
            conn.query(userLogin,[
                user.user_id,applicant_id,user.password,user.passcode_pin,role_id,email_verified,mobile_verified
              ]).then().catch();
        }).catch(err=>{
            reject(err);
        })
      })
    }

    //Method to check duplicate record
    checkDuplicateRecord(email, mobile, accountType) {
        return new Promise(function (resolve, reject) {
        myPool.query(`SELECT c.contact_id, c.email, c.mobile FROM applicant a,contact c WHERE a.account_type='${accountType}'
        AND c.applicant_id = a.applicant_id AND (c.email='${email}'
        OR c.mobile =${mobile})`).then(res => {
            resolve(res);
        }).catch(err => {
        console.log(err);
        reject(`${err}`);
             })
          })
        }

     exp(){
         return "Hello";
     }   
}

export class Demo {
    constructor(msg){
        this.val = {
            "msg" : msg
        }
    }
    get(){
        return "Hello sekhar";
    }
}

// obj.userRegistration = function (newData, result) {
//     return new Promise(function (resolve, reject) {
//         mariadb.createConnection(config).then(conn => {
//             conn.beginTransaction().then(() => {
//                 conn.query(configVariable.sql.insert_applicant, [newData.account_type, newData.next_step]).then((applicantResponse) => {
//                     resolve({ id: applicantResponse.insertId, connection: conn });
//                 }).catch((err) => {
//                     conn.rollback(err);
//                     conn.close();
//                     reject(`${err}`);
//                 })
//             }).catch(err => {
//                 reject(`${err}`);
//             })
//         }).catch(err => {
//             reject(`${err}`);
//         })
//     });
// }
// obj.userContact = function (newData, conn, id) {
//     return new Promise(function (resolve, reject) {
//         conn.query(configVariable.sql.insert_contact,
//             [id, newData.first_name, newData.middle_name, newData.last_name, newData.email, newData.gender, newData.dob, newData.telephone, newData.mobile, newData.phone
//             ]).then((conRes) => {
//                 resolve({ contactId: conRes.insertId })
//             }).catch(err => {
//                 conn.rollback(err);
//                 conn.close();
//                 reject(`${err}`);
//             })
//     })
// }
// obj.userAddress = function (newData, conn, address_type_id, id, contactId) {
//     return new Promise(function (resolve, reject) {
//         conn.query(configVariable.sql.insert_address,
//             [newData.country_id, address_type_id, newData.postal_code, newData.address_line1, newData.address_line2, id, newData.city,
//             newData.town, newData.region, contactId
//             ]).then((addRes) => {
//                 resolve({ addressId: addRes.insertId });
//             }).catch(err => {
//                 conn.rollback(err);
//                 conn.close();
//                 reject(`${err}`);
//             })
//     })
// }
// obj.userLogin = function (newData, conn, userLogin, id, roleId) {
//     return new Promise(function (resolve, reject) {
//         conn.query(userLogin,
//             [newData.email, id, hashPassword.generate(newData.password),
//             newData.passcode_pin, roleId, 1, 1]).then((userlogRes) => {
//                 conn.query(configVariable.sql.insert_kyc, [id]).then(kycRes => {
//                     conn.query(configVariable.sql.insert_account, [id, roleId, "EUR", 1, 0]).then(accountRes => {
//                         resolve(accountRes);
//                     }).catch(err => {
//                         conn.rollback(err);
//                         conn.close();
//                         reject(`${err}`);
//                     })
//                 }).catch(err => {
//                     conn.rollback(err);
//                     conn.close();
//                     reject(`${err}`);
//                 })
//             }).catch(err => {
//                 conn.rollback(err);
//                 conn.close();
//                 reject(`${err}`);
//             })
//     })
// }
// obj.userSandbox = function (newData, conn, id, memberId, apiKey, url, api_doc_url, redirect_url) {
//     return new Promise(function (resolve, reject) {
//         conn.query(configVariable.sql.insert_sandbox, [id, memberId, apiKey, url, api_doc_url, redirect_url]).then((result) => {
//             resolve(result);
//         }).catch(err => {
//             conn.rollback(err);
//             conn.close();
//             reject(`${err}`);
//         })
//     })
// }
// obj.connectionCommit = function (conn) {
//     return new Promise(function (resolve, reject) {
//         conn.commit();
//         conn.close();
//     })
// }
// //this method is used for check email or phone no is exists or not 
// obj.checkDuplicateRecord = function (newData, accountType) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(`SELECT c.contact_id, c.email, c.mobile FROM applicant a,contact c WHERE a.account_type='${accountType}'
// 		AND c.applicant_id = a.applicant_id AND (c.email='${newData.email}'
// 		OR c.mobile =${newData.mobile})`).then(res => {
//             resolve(res);
//         }).catch(err => {
//             console.log(err);
//             reject(`${err}`);
//         })
//     })
// }


// // this method is used for check unique value 
// obj.checkUnique = function (request, response) {
//     return new Promise(function (resolve, reject) {
//         var data = request.body.emailORmobile;
//         var column;
//         if (typeof data == 'undefined') {
//             return (response.send({ message: configVariable.message.indexCountry.checkRequest, status: 0 }))
//         }
//         else if (data.length) {
//             data.includes('@') ? column = 'email' : column = 'mobile';
//             myPool.query(`SELECT COUNT(*) as row FROM contact WHERE ${column} = '${request.body.emailORmobile}'`).then((result, err) => {
//                 if (err) {
//                     reject({ message: configVariable.message.indexCountry.operationError, status: 0 });
//                 } else {
//                     result[0].row ? resolve({ message: `${column} already exist.`, status: 0 }) : resolve({ message: `${column} does not exist.`, status: 1 });
//                 }
//             })
//                 .then((err) => {
//                     reject({ Error: `${err}`, status: 0 })
//                 })
//         } else {
//             resolve({ message: configVariable.message.indexCountry.checkValue, status: 0 });
//         }

//     })
// }

// obj.loginUser = function (newData, table) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(`select password from ${table} where user_id = '${newData.email}'`).then(res => {
//             resolve(res);
//         }).catch(err => {
//             reject(`${err}`);
//         })
//     })
// }

// // check input is valid or not 
// obj.uniqueInput = function (request, response) {sqlInjecter
//     return new Promise(function (resolve, reject) {
//         var value = request.body.value;
//         var check = ''
//         if (typeof (value) != 'undefined') {
//             if (_.includes(value, '@')) {
//                 check = "email"
//             } else {
//                 check = "mobile"
//             }
//         } else {
//             resolve({ message: configVariable.message.indexCountry.inputError, status: 0 })
//         }
//         myPool.query(`select contact_id from contact where ${check}  = '${value}'`).then(res => {
//             if (_.size(res) > 0) {
//                 resolve({ message: `${check} found`, status: 1 });
//             } else {
//                 resolve({ message: `${check} not found`, status: 0 });
//             }
//         }).catch(err => {
//             resolve({ Error: `${err}`, status: 0 })
//         })
//     });
// }

// // used to get user details 
// obj.getUserdetails = function (req, res) {
//     var email = req.body.email;
//     return new Promise(function (resolve, reject) {
//         //query for get the user details
//         myPool.query(UserDetailsConfig.config.sql, [email]).then(results => {
//             if (_.size(results) > 0) {
//                 res.json({ status: 1, message: `${UserDetailsConfig.message.success}`, data: results[0] });
//             } else {
//                 res.json({ status: 0, message: `${UserDetailsConfig.message.fail}` });
//             }
//         }).catch(err => {
//             resolve({ status: 0, message: `${err}` })
//         })
//     })
// }

// // used for login
// // obj.login = (request, response) => {
// //     return new Promise((resolve, reject) => {
// //         var email = request.body.email;
// //         var pwd = request.body.password;
// //         var mpin = request.body.mpin;
// //         var role = 1;
// //         var roleName = "Personal"
// //         var table = 'user_login'
// //         if (_.toLower(request.body.account_type) != "personal") {
// //             table = 'business_users'
// //             if (_.toLower(request.body.account_type) == "business") {
// //                 role = 2;
// //                 roleName = "Business"
// //             } else {
// //                 role = 7;
// //                 roleName = "Sandbox"
// //             }
// //         }
// //         if (typeof (email) == 'undefined' || email == "") {
// //             resolve({ message: loginconfigVariable.message.emailNotFound, status: 0 })
// //         } else if (pwd != "" && typeof (pwd) != 'undefined') {
// //             // login with password 
// //             myPool.query(`select password from ${table} where user_id = '${request.body.email}'`).then(res => {
// //                 if (_.size(res) > 0) {
// //                     if (hashPassword.verify(request.body.password, res[0].password)) {
// //                         createResponse(request.body.email, roleName).then(function (data) {
// //                             checkInitialPayment(JSON.parse(data)).then(function (result) {
// //                                 resolve(result)
// //                             }, function (err) {
// //                                 reject({ message: `${err}`, status: 0 })
// //                             })
// //                         }, function (err) {
// //                             reject({ message: `${err}`, status: 0 })
// //                         })
// //                     } else {
// //                         reject({ message: loginconfigVariable.message.passwordInvalid, status: 0 })
// //                     }
// //                 } else {
// //                     reject({ message: loginconfigVariable.message.emailNotFound, status: 0 })
// //                 }

// //             })
// //         } else {
// //             // login with MPIN
// //             myPool.query(`select passcode_pin from ${table} where user_id = '${email}'`).then(res => {
// //                 if (_.size(res) > 0 && mpin == res[0].passcode_pin) {
// //                     createResponse(email, roleName).then(function (data) {
// //                         checkInitialPayment(JSON.parse(data)).then(function (result) {
// //                             resolve(result)
// //                         }, function (err) {
// //                             reject({ message: `${err}`, status: 0 })
// //                         })
// //                     }, function (err) {
// //                         reject({ message: `${err}`, status: 0 })
// //                     })
// //                 } else {
// //                     resolve({ message: loginconfigVariable.message.emailNotFound, status: 0 })
// //                 }
// //             })
// //         }
// //     })
// // }

// //this is for the check the intialpayment status
// obj.checkInitialPayment = function (data) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(` SELECT applicant_id FROM accounts  where applicant_id = ${data.userInfo.applicant_id}`).then(result => {
//             resolve(result);
//         }).catch(err => {
//             reject(`${err}`);
//         })
//     })
// }

// // this function is used for create response and send back 
// obj.responseCreation = function (email, role) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(`select a.applicant_id, a.account_type, a.next_step, c.email, c.first_name, c.gender, c.last_name, c.mobile,c.phone,
//                     ad.address_line1, ad.address_line2, ad.city, ad.country_id, ad.postal_code, ad.region, ad.town, k.kyc_status
//                     from applicant a, contact c, address ad, kyc k
//                     where a.applicant_id=c.applicant_id and a.applicant_id= ad.applicant_id and  a.account_type ='${role}' and a.applicant_id= k.applicant_id and c.email = '${email}'`).then(res => {
//             resolve(res);
//         }).catch((err) => {
//             reject(`${err}`);
//         })

//     })
// }

// // used for get business id and append in the response of signup/ login
// obj.getBusinessId = function (application_id) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(`select business_id,country_of_incorporation,business_legal_name from business_details where applicant_id = ${application_id}`).then((result) => {
//             resolve(result);
//         }).catch((err) => {
//             reject(`${err}`);
//         })

//     });
// }

// obj.getPin = function (table, email) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(`select passcode_pin from ${table} where user_id = '${email}'`).then(res => {
//             resolve(res);
//         })
//     })
// }
// obj.selectSandbox = function (id) {
//     return new Promise(function (resolve, reject) {
//         myPool.query(`${configVariable.sql.select_sandbox}`, [id]).then((res) => {
//             resolve(res);
//         }).catch(err => {
//             reject(`${err}`);
//         })
//     })
// }
// // used for forgot password 
// obj.forgotPassword = function (req) {
//     return new Promise(function (resolve, reject) {
//         let business_type = (req.body.account_type === 'business' || req.body.account_type === 'sandbox') ? `business_users` : `user_login`;
//         myPool.query(`SELECT user_id FROM ${business_type} WHERE user_id  = "${req.body.email}"`).then((result, err) => {
//             if (err) {
//                 reject({ "message": `${err}`, status: 0 });
//             } else {
//                 if (result.length > 0) {
//                     mailer.forgotStatus(result[0].user_id, `http://${process.env.FORGOT_PASSWORD_URL}:4200/#/${req.body.account_type}-forgot/${encrypt(result[0].user_id)} , ${req.body.account_type}`).then(function (data) {
//                         if (data.status == 1) {
//                             resolve({ "message": `Email sent to ${req.body.email} , please re-set new password `, status: 1 });
//                         }
//                     }, function () { resolve({ message: "Email sending failure", status: 0, expire: 0 }); })

//                 } else {
//                     reject({ "message": `There is no user with  ${req.body.email} , please verify`, status: 0 });
//                 }
//                 // resolve(result);
//             }
//         }).then(() => {
//             resolve({ "message": `Email sent to ${req.body.email} , please re-set new password `, status: 1 });
//         })
//     });
// }

// // sendbox details as Email

// obj.sandBoxDetailsEmail = function (req) {
//     return new Promise(function (resolve, reject) {
//         var email = req.body.email;
//         var applicant_id = req.body.applicant_id;
//         if (email != 'undefined') {
//             myPool.query(`${loginconfigVariable.sql.select_sandbox_info}`, [applicant_id]).then((result, err) => {
//                 if (err) {
//                     reject({ "message": `${err}`, status: 0 });
//                 } else {
//                     if (result.length > 0) {
//                         mailer.sandBoxInfo(email, result[0], process.env.SANDBOX_API_DOC_URL).then(function (data) {
//                             if (data.status == 1) {
//                                 resolve({ "message": `${loginconfigVariable.message.emailSuccess} : ${email}`, status: 1 });
//                             }
//                         }, function () { resolve({ message: loginconfigVariable.message.emailFail, status: 0 }); })

//                     } else {
//                         reject({ "message": `${loginconfigVariable.message.errorMessage}`, status: 0 });
//                     }
//                 }
//             }).then(() => {
//                 resolve({ "message": `${loginconfigVariable.message.emailSuccess} : ${email}`, status: 1 });
//             })
//         }
//         else {
//             reject({ status: 0, message: loginconfigVariable.message.noDataError })
//         }
//     });
// }

// // used for reset password 
// obj.updatePassword = function (req) {
//     let business_type = (req.params.type === 'business' || req.params.type === 'sandbox') ? `business_users` : `user_login`;
//     return new Promise(function (resolve, reject) {
//         let sql = `update ${business_type} set password = '${hashPassword.generate(req.body.newPassword)}' where user_id = '${decrypt(req.params.code)}'`
//         myPool.query(sql).then((result, err) => {
//             if (err) {
//                 reject({ "message": `${err}`, status: 0 });
//             } else {
//                 resolve({ "message": `New Password Updated successfully`, status: 1, data: result });
//             }
//         });
//     });
// }

// // used for change password from profile page 
// obj.changePassword = function (req) {
//     return new Promise(function (resolve, reject) {
//         let business_type = (req.body.account_type === 'business' || req.body.account_type === 'sandbox') ? `business_users` : `user_login`;
//         myPool.query(`SELECT password FROM ${business_type} WHERE applicant_id = ${req.body.applicant_id}`).then((result) => {
//             if (result.length > 0) {
//                 if (hashPassword.verify(req.body.oldPassword, result[0].password)) {
//                     let sql = `update ${business_type} set password = '${hashPassword.generate(req.body.newPassword)}' where applicant_id = ${req.body.applicant_id}`
//                     myPool.query(sql).then((result, err) => {
//                         if (err) {
//                             reject({ "message": `${err}`, status: 0 });
//                         } else {
//                             resolve({ "message": `Password changed successfully`, status: 1 });
//                         }
//                     });
//                 } else {
//                     reject({ "message": `Please enter valid old password`, status: 0 });
//                 }
//             }
//         }, function (err) {
//             reject({ "message": `${err}`, status: 0 });
//         })
//     });
// }

// obj.resetPassword = function (req) {
//     return new Promise(function (resolve, reject) {
//         let business_type = (req.body.account_type === 'business' || req.body.account_type === 'sandbox') ? `business_users` : `user_login`;
//         if (req.body.password && req.body.password != 'undefined') {
//             let sql = `update ${business_type} set password = '${hashPassword.generate(req.body.password)}' where user_id = '${decrypt(req.body.id)}'`
//             myPool.query(sql).then((result, err) => {
//                 if (err) {
//                     reject({ "message": `${err}`, status: 0 });
//                 } else {
//                     resolve({ "message": `Password changed successfully`, status: 1 });
//                 }
//             });
//         } else {
//             reject({ "message": `Please enter valid  password`, status: 0 });
//         }
//     });
// }

// var encrypt = function (text) {
//     var cipher = crypto.createCipher('aes-256-cbc', 'd6F3Efeq')
//     var crypted = cipher.update(text, 'utf8', 'hex')
//     crypted += cipher.final('hex');
//     return crypted;
// }

// var decrypt = function (text) {
//     var decipher = crypto.createDecipher('aes-256-cbc', 'd6F3Efeq')
//     var dec = decipher.update(text, 'hex', 'utf8')
//     dec += decipher.final('utf8');
//     return dec;
// }


// module.exports = { obj }