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
	db.createTable('reports', {
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
		name: {
			type: 'string',
			required: true
		},
		template_uuid: {
			type: 'string',
			required: true
		},
		user_uuid: {
			type: 'string',
			required: true
		},
		orders_uuid: {
			type: 'string',
			required: true
		},
		is_deleted: {
			type: 'int',
			defaultValue: 0,
		},
		doctor_uuid: {
			type: 'string',
			required: true
		},
		metadata: {
			type: 'text',
			defaultValue: null
		},
		path: {
			type: 'string',
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
	return db.dropTable('reports', callback)
}

exports._meta = {
  "version": 1
};
