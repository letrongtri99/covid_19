/**
 * Templates.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'templates',
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
		user_uuid: {
			type: 'string',
			isUUID: true
		},
		group_uuid: {
			type: 'string',
			isUUID: true
		},
		name: {
			type: 'string'
		},
		metadata: {
			type: 'string',
			columnType: 'text',
		},
		path: {
			type: 'string',
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

