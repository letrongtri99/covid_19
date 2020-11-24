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
	db.createTable('templates', {
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
		user_uuid: {
			type: 'string',
		},
		group_uuid: {
			type: 'string'
		},
		name: {
			type: 'string'
		},
		metadata: {
			type: 'text'
		},
		path: {
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
	return db.dropTable('templates', callback)
};

exports._meta = {
  "version": 1
};
