'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
	db.createTable('patients_information', {
		id: {
			type: 'int',
			primaryKey: true,
			unique: true,
			autoIncrement: true,
			length: 11
		},
		uuid: {
			type: 'string',
			unique: true,
			required: true
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
			defaultValue: null
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
			defaultValue: null
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
		gender: {
			type: 'string'
		},
		zip: {
			type: 'string',
			length: 20
		},
		allow_contact: {
			type: 'int',
			length: 1,
			defaultValue: 0
		},
		phone_number: {
			type: 'int',
			length: 20,
			defaultValue: null
		},
		user_uuid_created: {
			type: 'string'
		},
		createdAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		},
		updatedAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		}
	}, callback)
};

exports.down = function(db, callback) {
	return db.dropTable('patients_information', callback);
};

exports._meta = {
  "version": 1
};
