import Patient from '../../Models/patients';
import { supabase } from '../../lib/supabase';

export const CREATE_PATIENT = "CREATE_PATIENT";
export const FETCH_PATIENT  = "FETCH_PATIENT";
export const DELETE_PATIENT = "DELETE_PATIENT";
export const UPDATE_PATIENT = "UPDATE_PATIENT";

export const fetchPatient = (id,name,email,contact,age,gender,prescription)=>{
	return async (dispatch,getState) =>{
		const userId = getState().auth.userId
		try{
			const { data, error } = await supabase
				.from('patients')
				.select('*')
				.eq('patient_id', userId);

			if(error){
				throw new Error(error.message || 'Something went wrong');
			}

			console.log("THIS IS PATIENT ACTION!!!");
			console.log(data);

			const loadedPatients = data.map(patient =>
				new Patient(
					patient.id,
					patient.name,
					patient.email,
					patient.contact,
					patient.age,
					patient.gender,
					patient.prescription,
					patient.patient_id
				)
			);

			dispatch({
				type: 'FETCH_PATIENT',
				patientData: loadedPatients[0] || null
			})
		} catch (err){
			throw err;
		}
	};

};

export const deletePatient = (id) =>{
	return async(dispatch,getState)=>{
		try {
			const { error } = await supabase
				.from('patients')
				.delete()
				.eq('id', id);

			if(error){
				throw new Error(error.message || 'Failed to delete patient');
			}

			dispatch({
				type: 'DELETE_PATIENT',
				patientId:id
			})
		} catch (err) {
			throw err;
		}
	};
};
export const UpdatePatient = (id,name,email, contact, age, gender,prescription )=>{
	return async(dispatch, getState)=>{
		const userId = getState().auth.userId;
		try{
			const { data, error } = await supabase
				.from('patients')
				.update({
					name,
					contact,
					prescription,
					updated_at: new Date().toISOString()
				})
				.eq('id', id);

			if (error){
				throw new Error(error.message || 'Something went wrong');
			}

			dispatch({
				type: 'UPDATE_PATIENT',
				patientId:userId,
				name,
				contact,
				prescription
			})
		}catch (err) {
			throw err;
		}

	}
}
export const CreatePatient = (id, name, email,contact,age,gender,prescription)=>{
	return async (dispatch,getState) => {
		const userId = getState().auth.userId;
		const Email = getState().auth.email;
		try{
			const { data, error } = await supabase
				.from('patients')
				.insert([{
					name,
					email,
					contact,
					age,
					gender,
					prescription,
					patient_id: userId,
					created_at: new Date().toISOString()
				}]);

			if (error){
				throw new Error(error.message || 'Something went wrong');
			}

			dispatch({
				type: 'CREATE_PATIENT',
				patientData:{
					id:data?.[0]?.id || userId,
					name:name,
					email:Email,
					contact:contact,
					age:age,
					gender:gender,
					prescription:prescription,
					patientId:userId,

				}
			});

		} catch (err){
			throw err;
		}
	};


}