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
	db.createTable('login', {
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
		email: {
			type: 'string'
		},
		password: {
			type: 'string',
			length: 255,
			required: true
		},
		user_uuid: {
			type: 'string',
			required: true
		},
		last_login: {
			type: 'timestamp'
		},
		last_ip_address: {
			type: 'string',
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

exports.down = function (db, callback) {
	return db.dropTable('login', callback);
};

exports._meta = {
	"version": 1
};
