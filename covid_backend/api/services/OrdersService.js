/**
**/

'use strict'

const Promise = require('bluebird');

module.exports = {
	createOrder: (data) => {
		let tasks = [];
		let orderInfo = {
			metadata: JSON.stringify(data.order_information),
			user_uuid: data.user_uuid,
			type: data.order_information.test_name || '',
		}
		let patientInfo = data.patient_information;
		let isNewPatient = (patientInfo && patientInfo.patient_uuid && patientInfo.patient_uuid != '') ? false : true;

		if (!isNewPatient) {
			tasks.push(PatientsService.update(patientInfo));
		} else {
			tasks.push(PatientsService.create(patientInfo))
		}

		return Promise.all(tasks)
			.then(result => {
				console.log(result[0][0]);
				orderInfo.patient_uuid = result[0][0].uuid;
				orderInfo.result = "unknown";
				return Orders.create(orderInfo).fetch()
			})
			.then(result => {
				if (result) {
					return result
				}
				return {}
			})
			.catch(err => {
				console.log(err + 'error OrdersSerivce@create')
			})
	},

	updateOrder: (orderUuid, data) => {
		let tasks = [];
		let orderInfo = {
			metadata: JSON.stringify(data.order_information),
			type: data.order_information.test_name || '',
		}
		let patientInfo = data.patient_information
		let isNewPatient = (patientInfo && patientInfo.patient_uuid && patientInfo.patient_uuid != '') ? false : true;

		if (!isNewPatient) {
			orderInfo.patient_uuid = patientInfo.patient_uuid
			tasks.push(PatientsService.update(patientInfo));
			tasks.push(Orders.update({ uuid: orderUuid }, orderInfo).fetch())
		} else {
			tasks.push(PatientsService.create(patientInfo).fetch())
		}
		return Promise.all(tasks)
			.spread(result => {
				console.log(result)
				if (!isNewPatient) {
					let newPatientInfo = result;
					orderInfo.patient_uuid = newPatientInfo.uuid;
					return Orders.update({ uuid: orderUuid }, orderInfo).fetch()
				}
				return [result[1]];
			})
			.then(order => {
				order[0].metadata = JSON.parse(order[0].metadata);
				return order[0];
			})
	}
}