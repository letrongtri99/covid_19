'use strict'
/**
 * Orders.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'orders',
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
		patient_uuid: {
			type: 'string',
			isUUID: true
		},
		metadata: {
			type: 'string',
			columnType: 'text',
			allowNull: true
		},
		user_uuid: {
			type: 'string',
		},
		status: {
			type: 'number',
			defaultsTo: 0
		},
		result: {
			type: 'string',
			columnType: 'text',
			allowNull: true
		},
		type: {
			type: 'string',
			allowNull: true
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

	statuses: {
		QUEUED: 0,
		ANALYZING: 1,
		ANALYZED: 2,
		REPORTED: 3,
		ERROR: 4,

		LIST: [0, 1, 2, 3, 4]
	},

	results: {
		LIST: ["positive", "negative", "unknown"]
	},

	getStatus: (status) => {
		switch(status) {
			case 0:
				return 'Queuing'
			case 1:
				return 'Analyzing'
			case 2:
				return 'Analyzed'
			case 3: 
				return 'Reported'
			case 4:
				return 'Error'
			default:
				return 'Unknown'
		}
	}
};

