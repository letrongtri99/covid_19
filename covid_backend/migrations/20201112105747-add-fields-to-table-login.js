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
	db.changeColumn('login', 'email', { type: 'string', notNull: false, unique: true }, callback);
	db.addColumn('login', 'status', { type: 'int', defaultValue: 0 }, callback);
};

exports.down = function (db, callback) {
	db.removeColumn('login', 'status', callback);
};

exports._meta = {
	"version": 1
};
