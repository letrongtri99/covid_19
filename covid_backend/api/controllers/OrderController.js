/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const sqlString = require('sqlstring');

module.exports = {
	find: (req, res) => {
		let currentUser = req.user;
		let searchTerm = req.body.searchTerm
		let filter = req.body.filter
		let grouping = req.body.grouping
		let sorting = req.body.sorting
		let column = sorting.column
		let sortOrder = sorting.direction
		let paginator = req.body.paginator
		let pageSize = paginator.pageSize ? paginator.pageSize : 10
		let page = paginator.page

		let skip = pageSize * (page - 1);
		let status = filter.status || Orders.statuses.LIST;
		let result = filter.result || Orders.results.LIST;
		let sqlSearchTerm = sqlString.escape('%' + searchTerm + '%')

		let searchFilter = ''
		let sortField = '';
		let total = 0;

		sortField = (column != 'patient_name') ? `o.${column} ${sortOrder}`
			: (`p.first_name ${sortOrder}, p.last_name ${sortOrder}`)


		searchFilter = searchTerm != '' ? `AND ( p.first_name LIKE  ${sqlSearchTerm} 
			OR p.last_name LIKE ${sqlSearchTerm} 
			OR o.result LIKE ${sqlSearchTerm} 
			OR CONCAT(p.first_name, ' ', p.last_name) LIKE ${sqlSearchTerm} )`
			: ''

		if (currentUser.role == Users.roles.DOCTOR) {
			searchFilter += ` AND o.user_uuid = ${currentUser.uuid}`
		}

		let queryStringFind = `
			SELECT
				CONCAT(p.first_name, ' ', p.last_name) as patient_name,
				o.uuid,
				o.id,
				o.result,
				o.patient_uuid,
				o.user_uuid,
				o.status,
				o.type,
				o.createdAt
			FROM
				orders as o
			LEFT JOIN patients_information as p
			ON o.patient_uuid = p.uuid
			WHERE o.status IN ( ${status} )
			AND o.result IN ( ${sqlString.escape(result)} )
			${searchFilter}
			ORDER BY ${sortField}
			LIMIT ${pageSize} OFFSET ${skip}
		`

		let queryStringCount = `
			SELECT COUNT(*) as total
			FROM
				orders as o
			LEFT JOIN patients_information as p
			ON o.patient_uuid = p.uuid
			WHERE o.status IN (${status})
			AND o.result IN (${sqlString.escape(result)})
			${searchFilter}
		`

		Orders.getDatastore().sendNativeQuery(queryStringCount)
			.then(countRecord => {
				total = countRecord.rows[0].total;
				if (total == 0) {
					res.json({
						items: [],
						total: 0
					})
					return false;
				}
				return Orders.getDatastore().sendNativeQuery(queryStringFind)
			})
			.then(result => {
				if (result) {
					result.rows.forEach(e => {
						e.status = Orders.getStatus(e.status);
					});
					return res.json({
						items: result.rows,
						total: total
					});
				}
			})
			.catch(error => {
				console.log("Error-LoginController@getUsers:", error);
				return res.json({ items: [], total: 0 })
			})
	},


	findByUuid: (req, res) => {
		let uuid = req.params.uuid;

		return Orders.findOne({ uuid: uuid })
			.then(order => {
				if (order) {
					order.metadata = JSON.parse(order.metadata);	
					return res.json({ status: "success", data: order })
				}
				return res.json({ status: "error", data: {}, message: "The given order do not exist!" })
			})
			.catch(err => {
				console.log("Error-OrderController@findByUuid:", error);
				return res.json({ status: "error", message: "Unknown error!" })
			})
	},

	getListPatients: (req, res) => {
		let queryString = `
			SELECT 
				CONCAT(first_name, ' ', last_name) as patient_name,
				uuid,
				patient_identifier
			FROM patients_information
			ORDER BY patient_name DESC
		`
		PatientsInformation.getDatastore().sendNativeQuery(queryString)
			.then(result => {
				let listPatients = result.rows;
				return res.json(listPatients)
			})
			.catch(error => {
				console.log("Error-OrderController@getListPaitents ", error);
				return ResponseService.error(res, "Unknown Error", 400);
			})
	},

	// delete: (req, res) => {
	//     let uuid = req.params.id;

	//     return PatientsInformation.update({uuid}, {is_deleted: 1})
	//     .then(result => {
	//         return res.send(result)
	//     })
	//     .catch(err => {
	//         console.log(err)
	//     })
	// },

	// deletePatients: (req, res) => {
	//     let id = req.body.ids
	//     let promises = []

	//     for(let i=0; i < id.length; i++) {
	//         promises.push(PatientsInformation.update({id: id[i]}).set({ is_deleted: 1 }))
	//     }

	//     return Promise.all(promises)
	//     .then(result => {
	//         return res.send(result)
	//     })
	//     .catch(err => {
	//         console.log(err)
	//     })
	// },

	updateOrder: (req, res) => {
		let orderUuid = req.body.order_uuid;
		let data = req.body.data;

		OrdersService.updateOrder(orderUuid, data)
			.then(order => {
				console.log(order);
				return res.json({ status: 'success', data: order });
			})
			.catch(error => {
				console.log("Error-OrderController@updateOrder", error);
				return ResponseService.error(res, 'Unknown error!', 400);
			})
	},

	createOrder: (req, res) => {
		let data = req.body.data;
		data.user_uuid = req.user.uuid;
		OrdersService.createOrder(data)
			.then(order => {
				return res.json({ status: 'success', data: order });
			})
			.catch(error => {
				console.log("Error-OrderController@createOrder", error);
				return ResponseService.error(res, 'Unknown error!', 400);
			})
	}


};

