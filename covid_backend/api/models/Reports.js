/**
 * Reports.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'reports',
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
		name: {
			type: 'string'
		},
		template_uuid: {
			type: 'string',
			isUUID: true,
			required: true
		},
		user_uuid: {
			type: 'string',
			isUUID: true,
			required: true
		},
		orders_uuid: {
			type: 'string',
			isUUID: true,
		},
		is_deleted: {
			type: 'number',
		},
		doctor_uuid: {
			type: 'string',
			isUUID: true,
		},
		metadata: {
			type: 'string',
			columnType: 'text',
		},
		path: {
			type: 'string'
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

};

