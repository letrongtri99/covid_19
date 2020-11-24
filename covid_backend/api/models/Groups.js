/**
 * Groups.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'groups',
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
		group_name: {
			type: 'string',
			required: true,
			maxLength: 255
		},
		user_uuid_created: {
			type: 'string',
			isUUID: true
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

