/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

	/* Test API */
	'/uuid': 'TestController.create',
	'/': 'TestController.removeJWT',
	'/pass': 'TestController.generatePassword',
	'/decode': 'TestController.decoded',

	/* Auth API */
	'POST /auth/login': 'AuthController.login',
	'POST /auth/logout': 'Auth.logout',
	'GET /auth/getCurrentUser': 'AuthController.getCurrentUser',
	'POST /auth/updateUserInfor': 'AuthController.updateUserInfor',
	'POST /auth/changePassword': 'AuthController.changePassword',

	/*Tri's part */
	'POST /getUsers': 'UserController.getUsers',
	'POST /createUserAdmin': 'UserController.createUserAdmin',
	'GET /user/:uuid': 'UserController.findById',
	'PUT /user/update': 'UserController.updateUser',
	'DELETE /user/delete/:uuid' : 'UserController.delete',

	/* Patients Controller */
	'POST /patients': 'PatientController.find',
	'GET /patients/all': 'PatientController.findAll',
	'GET /patients/:id': 'PatientController.findById',
	'DELETE /patients/delete/:id': 'PatientController.delete',
	'PUT /patients/deletePatients': 'PatientController.deletePatients',
	'POST /patients/create': 'PatientController.create',
	'PUT /patients/update': 'PatientController.update',

	/* Orders Controller */
	'POST /orders': 'OrderController.find',
	'GET /orders/getOrderById/:uuid': 'OrderController.findByUuid',
	'GET /orders/getListPatients/' : 'OrderController.getListPatients',
	'DELETE /orders/delete/:uuid': 'OrderController.delete',
	'PUT /orders/deleteOrders': 'OrderController.deleteOrders',
	'POST /orders/createOrder': 'OrderController.createOrder',
	'POST /orders/updateOrder': 'OrderController.updateOrder'

	/***************************************************************************
	*                                                                          *
	* More custom routes here...                                               *
	* (See https://sailsjs.com/config/routes for examples.)                    *
	*                                                                          *
	* If a request to a URL doesn't match any of the routes in this file, it   *
	* is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
	* not match any of those, it is matched against static assets.             *
	*                                                                          *
	***************************************************************************/


};
