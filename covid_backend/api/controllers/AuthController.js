'use strict'
/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const Promise = require('bluebird');

module.exports = {
	/**
	 * API for client to post login
	 * @param {request object} req
	 * @param {response object} res
	 * @return {JSON}
	 */
	login: (req, res) => {
		let email = req.body.email;
		let password = req.body.password;

		if (req.user && req.user.uuid) {
			return ResponseService.error(res, 'You have already logged in!');
		}

		if (!email || email == '' || !password || password == '') {
			return ResponseService.error(res, 'Email or password is invalid!', 401);
		}

		let loginUser, user;

		Login.findOne({ email: email })
			.then(loginResult => {
				if (!loginResult) {
					throw ResponseService.customError('Your account is not registered.');
				}

				if (!loginResult || (loginResult && loginResult.status == Login.statuses.DELETED)) {
					throw ResponseService.customError('Your account has been deleted. Please contact admin!.');
				}

				if (loginResult.status == Login.statuses.DISABLED) {
					throw ResponseService.customError('Your account is not activated!');
				}

				loginUser = loginResult;

				return bcrypt.compare(escape(password), loginResult.password)
			})
			.then(isPasswordMatched => {
				if (isPasswordMatched) {
					return Users.findOne({ uuid: loginUser.user_uuid });
				} else {
					throw ResponseService.customError("Password is incorrect!");
				}
			})
			.then(userFound => {
				if (!userFound || (userFound && userFound.status == Users.statuses.DELETED)) {
					throw ResponseService.customError('Your account has been deleted. Please contact admin!.');
				}

				if (userFound.status == Users.statuses.DISABLED) {
					throw ResponseService.customError('Your account is not activated!');
				}

				user = userFound;
				
				let last_login = new Date();
				let last_ip_address = CommonService.getIpAddress(req);

				return Login.update({ uuid: loginUser.uuid }, { last_login: last_login, last_ip_address: last_ip_address });
			})
			.then(result => {
				let data = {
					uuid: user.uuid
				};
				let token = JwtService.generateJwt(data, 60 * 60 * 24 * 7);

				res.cookie('access_token', token, sails.config.COOKIES_CONFIG);

				return ResponseService.success(res, "Logged in successfully!");
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				} else {
					console.log("Error-LoginController@login:", error);
					return ResponseService.error(res);
				}
			})
	},

	/**
	 * API for client to post logout
	 * @param {request object} req
	 * @param {response object} res
	 * @return {JSON}
	 */
	logout: (req, res) => {
		let token = req.token;
		JwtService.addJwtToBlacklist(token);
		res.clearCookie('access_token');
		return ResponseService.success(res, "Logged out successfully!");
	},

	/**
	 * API for client to post logout
	 * @param {request object} req
	 * @param {response object} res
	 * @return {JSON}
	 */
	getCurrentUser: (req, res) => {
		return res.json({ status: 'success', data: req.user });
	},


	/**
	 * API for client to change password of current user
	 * @param {request object} req
	 * @param {response object} res
	 * @return {JSON}
	 */
	changePassword: function (req, res) {
		let email = req.body.email;
		let password = req.body.password;
		let newPassword = req.body.newPassword;

		Login.findOne({ email })
			.then(function (data) {
				return bcrypt.compare(escape(password), data.password);
			})
			.then(function (isPasswordMatched) {
				if (isPasswordMatched && newPassword.length >= 6) {
					let tempd = bcrypt.hashSync(newPassword, 10);
					return Login.update({ email: email }, { password: tempd })
				}
				else {
					throw ResponseService.customError('Your current password is incorrect');
				}
			})
			.then(function (data) {
				return ResponseService.success(res, 'Update your password successfully');
			})
			.catch(function (error) {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				}
				console.log("Error-AuthController@changePassword: ", error);
				return ResponseService.error(res, "Unknown Error!");
			})
	},
	/**
	 * API for client to update current User information
	 * @param {request object} req
	 * @param {response object} res
	 * @return {JSON}
	 */
	updateUserInfor: function (req, res) {
		let id = req.body.id;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let email = req.body.email;
		let facility_name = req.body.facility_name;
		let state = req.body.state;
		let city = req.body.city;
		let zip = req.body.zip;
		let phone_number = req.body.phone_number;
		let currentEmail = req.body.currentEmail;

		if (email != currentEmail) {
			Login.findOne({ email })
				.then(function (data) {
					if (data) {
						throw ResponseService.customError('Email has been used');
					}
					return Login.update({ email: currentEmail }, { email: email })
				})
				.then(function (data) { // Must use uuid to update.
					return Users.update(id, { first_name: first_name, last_name: last_name, facility_name: facility_name, state: state, city: city, zip: zip, phone_number: phone_number })
				})
				.then(function (data) {
					return res.json({ status: 'success', message: 'Update your personal information successfully!' })
				})
				.catch(function (error) {
					if (ResponseService.isCustomError(error)) {
						return ResponseService.error(res, error.message);
					}
					console.log(error);
					return ResponseService.error(res, "Unknown error!");
				})
		}
		else { // Must use uuid to update
			Users.update(id, { first_name: first_name, last_name: last_name, facility_name: facility_name, state: state, city: city, zip: zip, phone_number: phone_number })
				.then(function (data) {
					return ResponseService.success(res, 'Update your personal information successfully!');

				})
				.catch(function (err) {
					console.log("Error-AuthController@updateUserInfor: ", err);
					return ResponseService.error(res, "Unknown error");
				})
		}
	},
};

