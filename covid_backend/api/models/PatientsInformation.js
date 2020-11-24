/**
 * PatientsInformation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
	tableName: 'patients_information',
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
			type: 'string',
			required: true
		},
		last_name: {
			type: 'string',
			required: true
		},
		middle_initial: {
			type: 'string',
			allowNull: true
		},
		dob: {
			type: 'string',
			required: true
		},
		race: {
			type: 'string',
			required: true
		},
		ethnicity: {
			type: 'string',
			required: true
		},
		patient_identifier: {
			type: 'string',
			required: true
		},
		language: {
			type: 'string',
			allowNull: true
		},
		street_address: {
			type: 'string',
		},
		city: {
			type: 'string',
		},
		state: {
			type: 'string'
		},
		country: {
			type: 'string'
		},
		gender: {
			type: 'string'
		},
		zip: {
			type: 'string',
			maxLength: 20
		},
		allow_contact: {
			type: 'number',
			defaultsTo: 0
		},
		phone_number: {
			type: 'number',
			allowNull: true
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
		},
		is_deleted: {
			type: 'number',
			defaultsTo: 0
		}

	}

};

