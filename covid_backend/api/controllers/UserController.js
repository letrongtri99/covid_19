'use strict'
/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const sqlString = require('sqlstring');
const moment = require('moment');

module.exports = {
	createUserAdmin: (req,res) => {
		Login.findOne({ email: req.body.email })
			.then((mail) => {
				if(mail) {
					return ResponseService.error(res, 'Your email has already exists!');
				} else {
					if(req.body.first_name && req.body.last_name && req.body.facility_name && req.body.city && req.body.state && req.body.zip && req.body.phone_number && req.body.email && req.body.password ) {
						Users.findOne({ 
							first_name : req.body.first_name, 
							last_name : req.body.last_name,
							phone_number : req.body.phone_number
						})
						.then((user)=> {
							if(user) {
								return user;
							} else {
								return Users.create({
									first_name : req.body.first_name,
									last_name : req.body.last_name,
									facility_name: req.body.facility_name,
									city : req.body.city,
									state : req.body.state,
									zip : req.body.zip,
									phone_number : req.body.phone_number,
									role : req.body.role,
									user_created : req.user.user_uuid
								}).fetch()
							}
						})
						.then((newUser) => {
							return Login.create({
								email : req.body.email,
								password : bcrypt.hashSync(req.body.password, 10),
								user_uuid : newUser.uuid
							}).fetch()
						})
						.then((newLogin)=> {
							return ResponseService.success(res, "Created user successfully");
						})
					} else {
						return ResponseService.error(res, 'You must fill all fields!');
					}
				}
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				} else {
					console.log("Error-LoginController@createUserAdmin:", error);
					return ResponseService.error(res);
				}
			})
		
	},
    getUsers : function (req,res) {
		let searchTerm = req.body.searchTerm
        let filter = req.body.filter
        let grouping = req.body.grouping

        let sorting = req.body.sorting
        let column = sorting.column
        let order = sorting.direction

        let paginator = req.body.paginator
        let pageSize = paginator.pageSize ? paginator.pageSize : 10
        let page = paginator.page
		let skip = pageSize * (page -1);
		let allData;
		let role = []
		let status = []
		let searchFilter = ''
		let sortField = ''

		if(!filter.role) {
			role = Users.roles.LIST;
		} else {
			role = [ filter.role ]
		}

		if(!filter.status) {
			status = Users.statuses.LIST
		} else {
			status = [ filter.status ]
		}

		if(sorting.column == 'name') {
			sortField = `users.first_name ` + sorting.direction + `, users.last_name ` + sorting.direction
		} else {
			sortField = `login.` + sorting.column + ' ' + sorting.direction
		}

		if(searchTerm != '') {
			searchFilter = ` AND ( users.first_name LIKE `+ sqlString.escape('%' + searchTerm + '%') + ` OR users.last_name LIKE ` + sqlString.escape('%' + searchTerm + '%') + ` OR login.email LIKE ` + sqlString.escape('%' + searchTerm + '%') +` )` 
		}

		var queryString = `
            SELECT
                login.id,
				login.uuid,
				login.email,
				login.last_login,
				login.last_ip_address,
				login.status,
				users.first_name,
				users.last_name,
				users.facility_name,
				users.city,
				users.state,
				users.zip,
				users.phone_number,
				users.role
            FROM
                login
			LEFT JOIN users ON users.uuid = login.user_uuid
			WHERE 
				users.role IN (` + role + `) AND login.status IN (` + status + `)` + searchFilter
			+ ` ORDER BY ` + sortField
			+ ` LIMIT `+ pageSize + ` OFFSET ` + skip;

		var queryStringCount = `
            SELECT
                login.id,
				login.uuid,
				login.email,
				login.last_login,
				login.last_ip_address,
				login.status,
				users.first_name,
				users.last_name,
				users.facility_name,
				users.city,
				users.state,
				users.zip,
				users.phone_number,
				users.role
            FROM
                login
			LEFT JOIN users ON users.uuid = login.user_uuid
			WHERE 
				users.role IN (` + role + `) AND login.status IN (` + status + `)` + searchFilter
		Login.getDatastore().sendNativeQuery(queryStringCount)
			.then((count) => {
				allData = count.rows;
				return Login.getDatastore().sendNativeQuery(queryString)
			})
			.then((select) => {
				select.rows.forEach(e => {
					if (e.last_login == null) {
						e.last_login = 'Unknown'
					} else {
						e.last_login = `${moment(e.last_login).format('YYYY/MM/DD')} at ${moment(e.last_login).format('HH:mm:ss')} `;
					}

					if(e.last_ip_address == null) {
						e.last_ip_address = 'Unknown'
					}
				});
				return res.json({
					data: select.rows,
					total : allData.length
				});
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				} else {
					console.log("Error-UserController@getUsers:", error);
					return ResponseService.error(res);
				}
			})
        
	},
	
	findById: (req, res) => {
        let uuid = req.params.uuid;
		var queryString= `
            SELECT
                login.id,
				login.uuid,
				login.email,
				login.last_login,
				login.last_ip_address,
				login.status,
				users.first_name,
				users.last_name,
				users.facility_name,
				users.city,
				users.state,
				users.zip,
				users.phone_number,
				users.role
            FROM
                login
			LEFT JOIN users ON users.uuid = login.user_uuid
			WHERE 
				login.uuid LIKE ` + sqlString.escape('%' + uuid + '%');
		Login.getDatastore().sendNativeQuery(queryString)
			.then((userId) => {
				return res.json(userId.rows[0]);
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				} else {
					console.log("Error-UserController@findById:", error);
					return ResponseService.error(res);
				}
			})
        
    },

	updateUser : (req,res) => {
		let uuid = req.body.uuid;
		var queryString= `
            UPDATE
                login
            LEFT JOIN
                users
			ON login.user_uuid = users.uuid
			SET  
				login.email = '` + req.body.email + `',` +
				` users.first_name = '` + req.body.first_name + `',` +
				` users.last_name = '` + req.body.last_name + `',` +
				` users.city = '` + req.body.city + `',` +
				` users.last_name = '` + req.body.last_name + `',` +
				` users.city = '` + req.body.city + `',` +
				` users.zip = '` + req.body.zip + `',` +
				` users.phone_number = '` + req.body.phone_number + `',` +
				` users.role = ` + req.body.role + `,` +
				` login.status = ` + req.body.status +
			` WHERE 
				login.uuid LIKE ` + sqlString.escape('%' + uuid + '%') ;
		Login.getDatastore().sendNativeQuery(queryString)
			.then((newUser) => {
				return res.json({text : 'tri'});
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				} else {
					console.log("Error-UserController@updateUser:", error);
					return ResponseService.error(res);
				}
			})
		
	},

	delete: (req,res) => {
		let uuid = req.params.uuid;
		var queryString= `
            UPDATE
                login
			LEFT JOIN
                users
			ON login.user_uuid = users.uuid
			SET  
				login.status = 1,
				users.status = 1` +
			` WHERE 
				login.uuid LIKE ` + sqlString.escape('%' + uuid + '%') ;
		Login.getDatastore().sendNativeQuery(queryString)
			.then((newUser) => {
				return ResponseService.success(res, "Delete user successfully");
			})
			.catch(error => {
				if (ResponseService.isCustomError(error)) {
					return ResponseService.error(res, error.message);
				} else {
					console.log("Error-UserController@delete:", error);
					return ResponseService.error(res);
				}
			})
	}
};

