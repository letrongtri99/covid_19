/**
 * Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'users',
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
		first_name: {
			type: 'string'
		},
		last_name: {
			type: 'string'
		},
		facility_name: {
			type: 'string'
		},
		city: {
			type: 'string'
		},
		state: {
			type: 'string'
		},
		zip: {
			type: 'string'
		},
		phone_number: {
			type: 'string'
		},
		role: {
			type: 'number',
			defaultsTo: 1
		},
		user_created: {
			type: 'string',
			isUUID: true,
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

	roles: {
		ADMIN: 0,
		DOCTOR: 1,
		LAB_OPERATOR: 2,
		LIST: [0, 1, 2]
	},

	statuses: {
		ACTIVE: 0,
		DELETED: 1,
		DISABLED: 2,
		LIST: [0, 2]
	}
};

