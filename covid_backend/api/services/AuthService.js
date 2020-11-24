'use strict'

const Promise = require('bluebird');
const sqlString = require('sqlstring');

module.exports = {
	/**
	 * Service use to get login user information
	 * @param {string} uuid
	 * @return {JSON}
	 */
	getUserInformation: (uuid) => {
		var queryString = `
            SELECT
				${Login.getLoginUserInformation('l', 'u')}
            FROM
                login as l
			LEFT JOIN users as u ON u.uuid = l.user_uuid
			WHERE 
				u.uuid = ` + sqlString.escape(uuid);

		return Login.getDatastore().sendNativeQuery(queryString)
			.then(result => {
				let user = result.rows[0];
				return user
			})
	}
}