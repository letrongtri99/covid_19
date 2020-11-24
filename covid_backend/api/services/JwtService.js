/**
**/

'use strict'
const jwt = require('jsonwebtoken');
const redis = require('redis')
const rc = redis.createClient(sails.config.redis.port, sails.config.redis.host);
const moment = require('moment');
const Promise = require('bluebird');

module.exports = {
	/**
	* Generate JWT
	* @param  {object} data
	* @param  {string} amountTime
	* @return {string} token
	*/
	generateJwt: (data, amountTime) => {
		let secret = sails.config.JWT_SECRET_KEY;
		let token = jwt.sign({ data: data }, secret, { expiresIn: amountTime });
		token = `Bearer ${token}`;

		return token;
	},

	/**
	* Add unwanted JWT to blacklist
	* @param  {string} token
	*/
	addJwtToBlacklist: (token) => {
		let blacklist = `jwt-blacklist:${token}`;
		rc.keys(blacklist, function (err, reply) {
			if (err) {
				console.log(err)
			} else {
				if (!reply || reply.length == 0) {
					rc.set(blacklist, token, function (err) {
						if (err) {
							console.log(`Error-JwtService@addJwtToBlacklist: ${err}`)
						}
					})
				}
			}
		})
	},

	/**
	* Check if JWT is exist in blacklist
	* @param  {string} token
	* @return {Promise}
	*/
	checkJwtInBlacklist: (token) => {
		let isExist = false;

		return new Promise((resolve, reject) => {
			rc.keys(`jwt-blacklist:${token}`, function (error, reply) {
				// reply is null when the key is missing
				if (error) {
					console.log(`Error-JwtService@checkJwtInBlacklist: ${error}`)
				}
				else {
					if (reply && reply.length > 0) {
						isExist = true;
					}
				}
				resolve(isExist);
			})
		})
	},

	/**
	* Remove JWT expired from blacklist
	*/
	removeExpiredJwtFromBlacklist: () => {
		let find = `jwt-blacklist:*`;
		rc.keys(find, function (error, reply) {
			if (error) {
				console.log(`Error-JwtService@removeExpiredJwtFromBlacklist: ${error}`)
			}
			else if (reply && reply.length > 0) {
				let removeKeys = reply.map(el => {
					return el.replace('jwt-blacklist:', '');
				}).filter(e => {
					let exp = jwt.decode(e).exp;
					let time = Date.now();
					return (time >= exp * 1000)
				}).map(e => {
					return `jwt-blacklist:${e}`;
				})

				console.log(removeKeys);
				
				rc.del(removeKeys, function (err, ouput) {
					console.log(ouput)
				});
			}
		})
	}
}