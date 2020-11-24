'use strict';

var dbm;
var type;
var seed;



/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db, callback) {
	db.createTable('users', {
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
			required: true,
		},
		first_name: {
			type: 'string',
			length: 100
		},
		last_name: {
			type: 'string',
			length: 100
		},
		facility_name: {
			type: 'string',
			length: 100
		},
		city: {
			type: 'string',
			length: 50
		},
		state: {
			type: 'string',
			length: 50
		},
		zip: {
			type: 'string',
			length: 20
		},
		phone_number: {
			type: 'int',
			length: 40
		},
		createdAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		},
		role: {
			type: 'int',
			length: 1
		},
		user_created: {
			type: 'string',
		},
		updatedAt: {
			type: 'timestamp',
			defaultValue: new String('CURRENT_TIMESTAMP')
		},
	}, callback);
};

exports.down = function (db, callback) {
	return db.dropTable('users', callback);
};

exports._meta = {
	"version": 1
};
