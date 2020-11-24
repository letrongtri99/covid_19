'use strict'
/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
	removeJWT: (req, res) => {
		// console.log("user: ", req.user);
		JwtService.removeExpiredJwtFromBlacklist();
		return res.json({ status: 'success' });
	},

	create: function (req, res) {
		console.log(uuidv4());
		return res.json("success");
	},

	generatePassword: (req, res) => {
		console.log(bcrypt.hashSync("123456", 10));
		return res.json("success");
	},

	decoded: (req, res) => {
		let e = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYzRmZTczNTQtYTJkMS00MzQ5LTg2YjgtM2M1MDg5YWU1MDM5IiwiaWF0IjoxNjA1MjA3MjU0LCJleHAiOjE2MDUyMDczMTR9.lrgkKy1pOPyO74famUwebUS9syPaMpjig5sy0xd8edQ"
		console.log(jwt.decode(e))
		return res.json("success");
	},

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
				.then(function (data0) {
					if (data0) {
						return res.json({ status: 'error', message: 'Email has been used' })
					}
					return Login.update({ email: currentEmail }, { email: email })
				})
				.then(function (data) {
					return Users.update(id, { first_name: first_name, last_name: last_name, facility_name: facility_name, state: state, city: city, zip: zip, phone_number: phone_number })
				})
				.then(function (data1) {
					return res.json({ status: 'success', message: 'Update your personal information successfully!' })
				})
				.catch(function (err) {
					console.log(err)
					return res.json({ status: 'error', message: 'Unknown error.' })
				})
		}
		else {
			Users.update(id, { first_name: first_name, last_name: last_name, facility_name: facility_name, state: state, city: city, zip: zip, phone_number: phone_number })
				.then(function (data) {
					return res.json({ status: 'success', message: 'Update your personal information successfully!' })

				})
				.catch(function (err) {
					console.log(err)
					return res.json({ status: 'error', message: 'Unknown error.' })
				})
		}
	},

	
};

