import React, { Component, useState, useCallback, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	Button,
	TouchableOpacity,
	TouchableWithoutFeedback,
	ImageBackground,
	ScrollView,
	FlatList,
	ActivityIndicator,
} from "react-native";
import Colors from "../constants/ThemeColors";
import HomeScreenCard from "../Components/HomeScreenCard";

import {PATIENTS} from "../Data/dummyData";
import * as AppointmentActions from '../store/actions/appointmentAction';
import * as PatientActions from '../store/actions/PatientAction';
import {useDispatch, useSelector} from 'react-redux';

import { MaterialCommunityIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";


const HomeScreen = (props) => {
	const Appointments = useSelector(state => state.appointment.appointments);

	const PatientName = useSelector(state => state.patient.patients.name);

	// Get user role from navigation params
	const userRole = props.route?.params?.userTitle || 'patient';

	console.log("PATIENT NAME");
	// console.log(PatientName);
	const dispatch = useDispatch();
	const [error , setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	
	// const userId = useSelector(state => state.auth.userId);
	// const data = useSelector(state => state.patient.find(id => patient.id == userId))
	// console.log("Patient Name")
	// console.log(Appointments);
	// console.log(userId)
	const stateSnap = useSelector(state => state)
	console.log("THIS IS THE STATE SNAP");
	console.log(stateSnap)


	
	// console.log(isLoading);
	const getPatients = useCallback(async()=>{
		setIsLoading(true)
		try{
			const patientData = await dispatch(PatientActions.fetchPatient());
		}catch (err) {
			setError(erro.message)
		}
		setIsLoading(false)
	},[isLoading, dispatch])

	const getData = useCallback(async()=>{
		setIsLoading(true)
		try{
			
			const currentAppointments = await dispatch(AppointmentActions.FetchAppointments());
			// console.log("currentAppointments");
			// console.log(currentAppointments)
		}catch (err){
			setError(err.message);
		}
		setIsLoading(false)
	}, [isLoading, dispatch]);

	useEffect(()=>{
		getPatients();
		getData();
		
	}, [dispatch]);
	
	const renderCard = (itemData) => {
		return (
			<View style={styles.renderList}>
				
				<HomeScreenCard
					name={itemData.item.Name}
					time={itemData.item.time}
				/>

			</View>
		);
	};

	if (isLoading){
			return (
				 <View style={styles.LoadingContainer}>
						<ActivityIndicator size="large"/>
				 </View>

				);
		}

	return (
		<View style={styles.screen}>
			<View style={styles.screenTop}>
				<View style={styles.GreetingsContainer}>
					<Text style={styles.Titletext}>
						Hello, {userRole === 'doctor' ? 'Dr. ' + (PatientName || 'Doctor') :
								userRole === 'nurse' ? 'Nurse ' + (PatientName || 'Nurse') :
								userRole === 'pharmacy' ? (PatientName || 'Pharmacy Staff') :
								userRole === 'lab' ? (PatientName || 'Lab Technician') :
								userRole === 'billing' ? (PatientName || 'Billing Staff') :
								userRole === 'reception' ? (PatientName || 'Reception') :
								userRole === 'admin' ? (PatientName || 'Administrator') :
								(PatientName || 'Patient')}
					</Text>
					<Text style={styles.Titletext}></Text>
				</View>

		
			</View>
					<View style={styles.ButtonsContainer}>
						{userRole === 'doctor' ? (
							// Doctor buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("appointments");
									}}
								>
									<View style={{marginRight:4, paddingBottom:4}}>
										<MaterialCommunityIcons
											name="account-clock"
											size={30}
											color="white"
										/>
									</View>
									<View style={{ marginTop: 0 }}>
										<Text style={styles.Buttontext}>Appointments</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
								>
									<FontAwesome5
										name="stethoscope"
										size={26}
										color="white"
									/>
									<View style={{ marginTop: 0 }}>
										<Text style={styles.Buttontext}>Consultations</Text>
									</View>
								</TouchableOpacity>
							</>
						) : userRole === 'nurse' ? (
							// Nurse buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("NurseDashboard");
									}}
								>
									<MaterialCommunityIcons
										name="medical-bag"
										size={30}
										color="white"
									/>
									<Text style={styles.Buttontext}>Patient Care</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("NurseDashboard");
									}}
								>
									<FontAwesome5
										name="heartbeat"
										size={26}
										color="white"
									/>
									<Text style={styles.Buttontext}>Vital Signs</Text>
								</TouchableOpacity>
							</>
						) : userRole === 'pharmacy' ? (
							// Pharmacy buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("PharmacyDashboard");
									}}
								>
									<FontAwesome5
										name="pills"
										size={30}
										color="white"
									/>
									<Text style={styles.Buttontext}>Inventory</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("PharmacyDashboard");
									}}
								>
									<MaterialCommunityIcons
										name="prescription"
										size={26}
										color="white"
									/>
									<Text style={styles.Buttontext}>Prescriptions</Text>
								</TouchableOpacity>
							</>
						) : userRole === 'lab' ? (
							// Lab Technician buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("LabDashboard");
									}}
								>
									<FontAwesome5
										name="flask"
										size={30}
										color="white"
									/>
									<Text style={styles.Buttontext}>Lab Tests</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("LabDashboard");
									}}
								>
									<MaterialCommunityIcons
										name="test-tube"
										size={26}
										color="white"
									/>
									<Text style={styles.Buttontext}>Samples</Text>
								</TouchableOpacity>
							</>
						) : userRole === 'billing' ? (
							// Billing Staff buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("BillingDashboard");
									}}
								>
									<FontAwesome5
										name="money-check"
										size={30}
										color="white"
									/>
									<Text style={styles.Buttontext}>Billing</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("BillingDashboard");
									}}
								>
									<MaterialCommunityIcons
										name="credit-card"
										size={26}
										color="white"
									/>
									<Text style={styles.Buttontext}>Insurance</Text>
								</TouchableOpacity>
							</>
						) : userRole === 'reception' ? (
							// Reception buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("ReceptionDashboard");
									}}
								>
									<MaterialCommunityIcons
										name="account-plus"
										size={30}
										color="white"
									/>
									<Text style={styles.Buttontext}>Registration</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("ReceptionDashboard");
									}}
								>
									<FontAwesome5
										name="calendar-alt"
										size={26}
										color="white"
									/>
									<Text style={styles.Buttontext}>Appointments</Text>
								</TouchableOpacity>
							</>
						) : userRole === 'admin' ? (
							// Administrator buttons
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("AdminDashboard");
									}}
								>
									<MaterialCommunityIcons
										name="cog"
										size={30}
										color="white"
									/>
									<Text style={styles.Buttontext}>Settings</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("AdminDashboard");
									}}
								>
									<FontAwesome5
										name="chart-bar"
										size={26}
										color="white"
									/>
									<Text style={styles.Buttontext}>Reports</Text>
								</TouchableOpacity>
							</>

						) : (
							// Patient buttons (default)
							<>
								<TouchableOpacity
									style={styles.floatingButtons1}
									activeOpacity={0.8}
									onPress={() => {
										props.navigation.navigate("appointmentsList");
									}}
								>
									<View style={{marginRight:4, paddingBottom:4}}>
										<MaterialCommunityIcons
											name="calendar-check"
											size={30}
											color="white"
										/>
									</View>
									<View style={{ marginTop: 0 }}>
										<Text style={styles.Buttontext}>My Visits</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.floatingButtons3}
									activeOpacity={0.8}
								>
									<FontAwesome5
										name="user-md"
										size={26}
										color="white"
									/>
									<View style={{ marginTop: 0 }}>
										<Text style={styles.Buttontext}>Find Doctors</Text>
									</View>
								</TouchableOpacity>
							</>
						)}
					</View>

			<View style={styles.InfoContainer}>
						{userRole === 'doctor' ? (
							// Doctor statistics
							<>
								<TouchableOpacity style={styles.PatientsNumber} onPress={()=>{
									props.navigation.navigate('appointmentsList');
								}} >
								<View style={styles.iconContainer}>
									<FontAwesome5 name="users" size={35} color='white' />
								</View>
									<Text style={{fontSize:20, color:'white'}}>{Appointments.length} Patients </Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.TotalCollection} onPress={() =>{
									const patients = dispatch(PatientActions.fetchPatient());
									console.log(patients);
								}}>
									<FontAwesome5
									name="money-check"
									size={35}
									color="white"
								/>
									<Text style={{fontSize:19, color:'white'}}>Rs. {Appointments.length*1000} </Text>
								</TouchableOpacity>
							</>
						) : (
							// Patient statistics
							<>
								<TouchableOpacity style={styles.PatientsNumber} onPress={()=>{
									props.navigation.navigate('appointmentsList');
								}} >
								<View style={styles.iconContainer}>
									<FontAwesome5 name="calendar-alt" size={35} color='white' />
								</View>
									<Text style={{fontSize:16, color:'white', textAlign:'center'}}>Next Visits</Text>
								</TouchableOpacity>
								<TouchableOpacity style={styles.TotalCollection}>
									<FontAwesome5
									name="heart"
									size={35}
									color="white"
								/>
									<Text style={{fontSize:16, color:'white', textAlign:'center'}}>Health Records</Text>
								</TouchableOpacity>
							</>
						)}
				</View>
			

			<View style={styles.ScreenBottom}>
				
				<View style={{flex:1}}>
				<FlatList 
						data={Appointments} 
						renderItem={renderCard}  
						ListEmptyComponent={()=>{
							return (
								<View>
								<Text style={{fontSize:20}}>NO ITEMS</Text>
								</View>
								);
						}}
						showsVerticalScrollIndicator={false}

				/>
				
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		height: "100%",
		width: "100%",
	},
	screenTop: {
		paddingTop: 60,
		paddingBottom: 30,
		backgroundColor: '#6366f1',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	ScreenBottom: {
		flex: 2,
		alignItems: "center",
		height: "100%",
		width:'100%',
		backgroundColor: '#f8fafc',
		paddingTop: 10,
	},

	text: {
		fontSize: 25,
		fontWeight: "bold",
		color: Colors.HomeScreenText,
	},
	Titletext: {
		fontSize: 28,
		fontWeight: "600",
		color: '#ffffff',
		letterSpacing: 0.5,
	},
	GreetingsContainer: {
		marginHorizontal: 25,
		paddingBottom: 10,
	},
	floatingButtons1: {
		width: 160,
		height: 90,
		flexDirection:'row',
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		backgroundColor: '#8b5cf6',
		shadowColor: '#8b5cf6',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
		margin: 5,
	},
	floatingButtons2: {
		width: 150,
		height: 80,
		justifyContent: "center",
		marginLeft: 25,
		alignItems: "center",
		borderRadius: 50,
		paddingTop:10,
		backgroundColor: Colors.RedButton,
	},
	floatingButtons3: {
		width: 160,
		height: 90,
		flexDirection:'row',
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		backgroundColor: '#10b981',
		shadowColor: '#10b981',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
		margin: 5,
	},
	Buttontext: {
		fontSize: 10,
		fontWeight: "600",
		color: "white",
		marginLeft: 4,
		letterSpacing: 0.2,
		textAlign: "center",
		flexWrap: "wrap",
	},
	ButtonsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: 20,
		paddingVertical: 25,
		backgroundColor: "#f8fafc",
	},
	background: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
		alignItems: "center",
	},
	
	listContainer: {
		width: 360,
		alignItems: "center",
		height: '100%',
		backgroundColor:'red'
	},
	renderList: {
		width:370,
		height:120,
		alignItems: "center",
	},
	InfoContainer: {
		width:'100%',
		height:200,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:"center",
		paddingHorizontal: 20,
		backgroundColor:'#f8fafc'
	},
	PatientsNumber:{
		width:150,
		height:130,
		alignItems: "center",
		borderRadius: 20,
		paddingVertical: 20,
		backgroundColor: '#6366f1',
		justifyContent:'space-around',
		shadowColor: '#6366f1',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 8,
	},
	TotalCollection:{
		width:150,
		height:130,
		alignItems: "center",
		borderRadius: 20,
		paddingVertical: 20,
		backgroundColor: '#059669',
		marginLeft:50,
		justifyContent:'space-around',
		shadowColor: '#059669',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 8,
	},
	iconContainer:{
		marginBottom:2,
	},
	LoadingContainer:{
		flex:1,
		justifyContent:'center',
		alignItems:'center'
	},
});

export default HomeScreen;
