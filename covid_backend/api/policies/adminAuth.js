'use strict'

module.exports = function (req, res, next) {

	let user = req.user;

	if (user.role != Users.roles.ADMIN) {
		return ResponseService.error(res, "Not authorized!");
	} else {
		return next();
	}
}