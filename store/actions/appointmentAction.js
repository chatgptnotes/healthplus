import Appointment from '../../Models/Appointment';
import { supabase } from '../../lib/supabase';


export const CREATE_APPOINTMENT = "CREATE_APPOINTMENT";
export const FETCH_APPOINTMENTS = "FETCH_APPOINTMENTS";


export const FetchAppointments = () =>{

	return async (dispatch,getState) => {
		const userId = getState().auth.userId;
		try{
			const { data, error } = await supabase
				.from('appointments')
				.select('*')
				.eq('patient_id', userId);

			if (error){
				throw new Error(error.message || "Something went wrong");
			}

			console.log(data);
			const loadedAppointments = data.map(appointment =>
				new Appointment(
					appointment.id,
					appointment.name,
					appointment.contact,
					appointment.email,
					appointment.date,
					appointment.time,
					appointment.fees,
					appointment.patient_id
				)
			);

			dispatch({
				type:FETCH_APPOINTMENTS,
				appointments:loadedAppointments
			})
		}catch (err){
			throw err;
		}
	}

	};



export const CreateAppointment = (Name, contact, email, date, time, fees) => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId
		try {
			const { data, error } = await supabase
				.from('appointments')
				.insert([{
					name: Name,
					contact,
					email,
					date,
					time,
					fees,
					patient_id: userId,
					created_at: new Date().toISOString()
				}]);

			if (error) {
				throw new Error(error.message || "Something went wrong");
			}

			dispatch({
				type: CREATE_APPOINTMENT,
				appointmentData: {
					Name: Name,
					contact: contact,
					email: email,
					date: date,
					time: time,
					fees: fees,
					patientId: userId
				},
			});
		} catch (err) {
			throw err;
		}
	};
};
