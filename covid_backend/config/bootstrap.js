/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

const CronJob = require('cron').CronJob

module.exports.bootstrap = async function () {
	// sails.hooks.http.app.set('trust proxy', true);

	// let removeExpiresJwtToken = new CronJob(
	// 	'* */5 * * * *',
	// 	JwtService.removeExpiredJwtFromBlacklist,
	// 	null,
	// 	true,
	// 	'UTC'
	// )

};
