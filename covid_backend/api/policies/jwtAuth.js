'use strict'

const jwt = require('jsonwebtoken');
const redis = require('redis')
const rc = redis.createClient(sails.config.redis.port, sails.config.redis.host);

module.exports = function (req, res, next) {
	let token;
	let loginUrl = '/auth/login';

	if (req.cookies && req.cookies.access_token) {
		let parts = req.cookies.access_token.split(' ');

		if (parts.length == 2) {
			let scheme = parts[0];
			let credentials = parts[1];

			if (/^Bearer$/i.test(scheme)) {
				token = credentials;
			}
		} else {
			return ResponseService.error(res, 'Format is Cookies: Bearer [token]', 400);
		}
	}
	else {
		if (req.path == loginUrl) {
			return next();
		}
		return ResponseService.error(res, 'No token provided', 401);
	}

	jwt.verify(token, sails.config.JWT_SECRET_KEY, function (err, decoded) {
		JwtService.checkJwtInBlacklist(token)
			.then(result => {
				if (err || result == true) {
					if (req.path == loginUrl) {
						throw ResponseService.customError('Next');
					}
					throw ResponseService.customError('Unauthorized access');
				}
				let uuid = decoded.data.uuid;
				return Users.findOne({ uuid: uuid })
			})
			.then(user => {
				if (user && user.status == Users.statuses.ACTIVE) {
					return AuthService.getUserInformation(decoded.data.uuid)
				} else {
					JwtService.addJwtToBlacklist(token);
					res.clearCookie('access_token');
					throw ResponseService.customError('Unauthorized access');
				}
			})
			.then(user => {
				req.user = user;
				req.token = token;
				return next();
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					if (error.message == 'Next') {
						return next();
					}
					// console.log("Error-jwtAuth: ", error);
					return ResponseService.error(res, error.message, 401);
				}
			})
	})
}