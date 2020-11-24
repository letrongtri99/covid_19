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
	db.createTable('orders', {
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
		patient_uuid: {
			type: 'string',
			required: true
		},
		metadata: {
			type: 'text',
			defaultValue: null
		},
		user_uuid: {
			type: 'string',
		},
		status: {
			type: 'int',
			defaultValue: 0
		},
		result: {
			type: 'text',
			defaultValue: null
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
	return db.dropTable('orders', callback);
};

exports._meta = {
	"version": 1
};
