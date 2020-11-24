/**
**/

'use strict'

module.exports = {
    create: (patientInfo) => {
        if(patientInfo) {
            return PatientsInformation.create(patientInfo).fetch()
        }
        return false
        .then(result => {
            if(result) {
                return result
            }
            return {}
        })
        .catch(err => {
            console.log(err + 'error PatientsService@create')
        })
    },

    update: (patientInfo) => {
        let uuid = patientInfo.patient_uuid;
        
        let updateQuery = {
            first_name: patientInfo.first_name,
            last_name: patientInfo.last_name,
            middle_initial: patientInfo.middle_initial,
            dob: patientInfo.dob,
            race: patientInfo.race,
            ethnicity: patientInfo.ethnicity,
            patient_identifier: patientInfo.patient_identifier,
            language: patientInfo.language,
            street_address: patientInfo.street_address,
            city: patientInfo.city,
            state: patientInfo.state,
            gender: patientInfo.gender,
            zip: patientInfo.zip,
            country: patientInfo.country,
            allow_contact: patientInfo.allow_contact,
            phone_number: patientInfo.phone_number
        }

        return PatientsInformation.update({uuid}, updateQuery).fetch()
        .then(result => {
            return result[0]
        })
        .catch(err => {
            console.log(err + 'error PatientsService@update')
        })
    },

    findPatientByUUID: (uuid) => {
        return PatientsInformation.findOne({uuid})
        .then(patient => {
            if(patient) {
                return patient
            }
            return {}
        })
        .catch(err => {
            console.log(err + 'error PatientsService@findPatientByUUID')
        })
    }
}