/**
 * Created by horyu1234 on 2017-11-14.
 * Modified by hatty163 on 2020-05-14.
 */
const fetch = require('node-fetch');
const GLOBAL = require("./global.json");

exports.verifyRecaptcha = function (responseToken, remoteIp, callback) {
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${GLOBAL.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${responseToken}&remoteip=${remoteIp}`;
    try {
        fetch(verifyUrl)
            .then(res => res.json())
            .then(json => callback(json['success']));
    } catch (e) {
        callback(false);
    }
};