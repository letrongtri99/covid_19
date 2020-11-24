/**
 * Login.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'login',
	primaryKey: 'id',
	attributes: {
		id: {
			type: 'number',
			unique: true,
			autoIncrement: true
		},
		uuid: {
			type: 'string',
			unique: true,
			autoIncrement: true,
			isUUID: true
		},
		email: {
			type: 'string',
			unique: true
		},
		password: {
			type: 'string',
			maxLength: 255,
			required: true
		},
		user_uuid: {
			type: 'string',
			isUUID: true,
			required: true
		},
		last_login: {
			type: 'ref',
			columnType: 'timestamp'
		},
		last_ip_address: {
			type: 'string',
			allowNull: true
		},
		status: {
			type: 'number',
			defaultsTo: 0
		},
		createdAt: {
			type: 'ref',
			columnType: 'timestamp',
			defaultsTo: new Date()
		},
		updatedAt: {
			type: 'ref',
			columnType: 'timestamp',
			defaultsTo: new Date()
		}
	},

	getLoginUserInformation: (login, users) => {
		let userInfo = `
			${login}.uuid,
			${login}.user_uuid,
			${login}.email,
			${login}.last_login,
			${login}.last_ip_address,
			${login}.status,
			${users}.first_name,
			${users}.last_name,
			${users}.facility_name,
			${users}.city,
			${users}.state,
			${users}.zip,
			${users}.phone_number,
			${users}.role
		`
		return userInfo
	},

	statuses: {
		ACTIVE: 0,
		DELETED: 1,
		DISABLED: 2
	}
};

