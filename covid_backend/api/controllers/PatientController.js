/**
 * PatientController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Promise = require('bluebird');

module.exports = {
    find: (req, res) => {
        let currentUser = req.user

        let searchTerm = req.body.searchTerm
        let filter = req.body.filter
        let grouping = req.body.grouping

        let sorting = req.body.sorting
        let column = sorting.column
        let order = sorting.direction

        let paginator = req.body.paginator
        let pageSize = paginator.pageSize ? paginator.pageSize : 10
        let page = paginator.page
        
        let query
        if(currentUser.role == 1) {
            query = {
                or: [
                    // { id: { contains: searchTerm == '' ? {} :  } },
                    { patient_identifier: { contains: searchTerm } },
                    { first_name: { contains: searchTerm } },
                    { last_name: { contains: searchTerm } },
                    { dob: { contains: searchTerm } },
                    { gender: { contains: searchTerm } },
                    { ethnicity: { contains: searchTerm } },
                    { createdAt: { contains: searchTerm } }
                ],
                is_deleted: 0,
                user_uuid_created: currentUser.user_uuid
            }
        } else {
            query = {
                or: [
                    // { id: { contains: searchTerm == '' ? {} :  } },
                    { patient_identifier: { contains: searchTerm } },
                    { first_name: { contains: searchTerm } },
                    { last_name: { contains: searchTerm } },
                    { dob: { contains: searchTerm } },
                    { gender: { contains: searchTerm } },
                    { ethnicity: { contains: searchTerm } },
                    { createdAt: { contains: searchTerm } }
                ],
                is_deleted: 0
            }
        }
        

        return Promise.all([PatientsInformation.find()
        .where(query)
        .limit(pageSize)
        .skip(pageSize * (page-1))
        .sort([
            { [column] : order.toUpperCase() }
        ]), PatientsInformation.count(query)])
        .spread((patients, total) => {
            return res.json({
                data: patients,
                total: total
            })
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@find:", error);
                return ResponseService.error(res);
            }
        })
    },

    // find all patient by docter owner
    findAll: (req, res) => {
        let currentUser = req.user
        
        let query
        if(currentUser.role == 1) {
            query = {
                is_deleted: 0,
                user_uuid_created: currentUser.user_uuid
            }
        } else {
            query = {
                is_deleted: 0
            }
        }
        
        return PatientsInformation.find(query)
        .then(patients => {
            return res.json(patients)
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@findAll:", error);
                return ResponseService.error(res);
            }
        })
    },

    
    findById: (req, res) => {
        let uuid = req.params.id;
        
        return PatientsInformation.findOne({uuid: uuid})
        .then(patient => {
            return res.send(patient)
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@findById:", error);
                return ResponseService.error(res);
            }
        })
    },

    delete: (req, res) => {
        let uuid = req.params.id;
        
        return PatientsInformation.update({uuid}, {is_deleted: 1})
        .then(result => {
            return res.send(result)
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@delete:", error);
                return ResponseService.error(res);
            }
        })
    },

    deletePatients: (req, res) => {
        let id = req.body.ids
        let promises = []

        for(let i=0; i < id.length; i++) {
            promises.push(PatientsInformation.update({id: id[i]}).set({ is_deleted: 1 }))
        }
        
        return Promise.all(promises)
        .then(result => {
            return res.send(result)
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@deletePatients:", error);
                return ResponseService.error(res);
            }
        })
    },

    update: (req, res) => {
        return PatientsService.update(req.body)
        .then(result => {
            return res.send(result)
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@update:", error);
                return ResponseService.error(res);
            }
        })
    },

    create: (req, res) => {
        let patientInfor = req.body;

        return PatientsService.create(patientInfor)
        .then(result => {
            return res.send(result)
        })
        .catch(error => {
            if (ResponseService.isCustomError(error)) {
                return ResponseService.error(res, error.message);
            } else {
                console.log("Error-PatientController@create:", error);
                return ResponseService.error(res);
            }
        })
    }


};

