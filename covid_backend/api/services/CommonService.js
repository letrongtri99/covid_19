
'use strict'

module.exports = {
	getIpAddress: (req) => {
		return req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.ip ? req.ip.replace(/::ffff:/g, "") : 'Unknown';
	}
}