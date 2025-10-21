import React, { Component, useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ScrollView,
	Platform,
	TouchableOpacity,
	Image,
	ImageBackground,
	SafeAreaView,
} from "react-native";
import Colors from "../constants/ThemeColors";
import Input from "../Components/input";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = (props) => {
	const userRoles = [
		{
			id: 'doctor',
			title: 'Doctor',
			subtitle: 'Medical Practitioner',
			icon: 'stethoscope',
			iconType: 'FontAwesome5',
			color: '#6366f1',
			navigation: 'auth'
		},
		{
			id: 'patient',
			title: 'Patient',
			subtitle: 'Healthcare Seeker',
			icon: 'account-heart',
			iconType: 'MaterialCommunityIcons',
			color: '#10b981',
			navigation: 'auth'
		},
		{
			id: 'nurse',
			title: 'Nurse',
			subtitle: 'Patient Care Specialist',
			icon: 'medical-bag',
			iconType: 'MaterialCommunityIcons',
			color: '#f59e0b',
			navigation: 'main',
			directDashboard: 'NurseDashboard'
		},
		{
			id: 'pharmacy',
			title: 'Pharmacy',
			subtitle: 'Medicine Management',
			icon: 'pills',
			iconType: 'FontAwesome5',
			color: '#ef4444',
			navigation: 'main',
			directDashboard: 'PharmacyDashboard'
		},
		{
			id: 'lab',
			title: 'Lab Technician',
			subtitle: 'Pathology & Testing',
			icon: 'flask',
			iconType: 'FontAwesome5',
			color: '#8b5cf6',
			navigation: 'main',
			directDashboard: 'LabDashboard'
		},
		{
			id: 'billing',
			title: 'Billing Staff',
			subtitle: 'Financial Services',
			icon: 'credit-card',
			iconType: 'FontAwesome5',
			color: '#06b6d4',
			navigation: 'main',
			directDashboard: 'BillingDashboard'
		},
		{
			id: 'reception',
			title: 'Reception',
			subtitle: 'Front Desk Services',
			icon: 'desk',
			iconType: 'MaterialCommunityIcons',
			color: '#84cc16',
			navigation: 'main',
			directDashboard: 'ReceptionDashboard'
		},
		{
			id: 'admin',
			title: 'Administrator',
			subtitle: 'System Management',
			icon: 'settings',
			iconType: 'Ionicons',
			color: '#1f2937',
			navigation: 'main',
			directDashboard: 'AdminDashboard'
		}
	];

	const renderIcon = (iconType, iconName, size, color) => {
		switch (iconType) {
			case 'FontAwesome5':
				return <FontAwesome5 name={iconName} size={size} color={color} />;
			case 'MaterialCommunityIcons':
				return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
			case 'Ionicons':
				return <Ionicons name={iconName} size={size} color={color} />;
			default:
				return <MaterialIcons name={iconName} size={size} color={color} />;
		}
	};

	const handleRolePress = (item) => {
		console.log('Role pressed:', item.title, item.id);

		try {
			if (item.directDashboard) {
				console.log('Navigating to direct dashboard:', item.directDashboard);
				// Navigate directly to main app and then to specific dashboard
				// Using navigate instead of reset to preserve back navigation
				props.navigation.navigate('main', {
					screen: 'HomeTab',
					params: {
						screen: item.directDashboard,
						params: { userTitle: item.id }
					}
				});
			} else {
				console.log('Navigating to auth with userTitle:', item.id);
				// Navigate to login screen within the auth stack
				props.navigation.navigate('login', {
					userTitle: item.id,
				});
			}
		} catch (error) {
			console.error('Navigation error:', error);
			alert(`Navigation failed for ${item.title}: ${error.message}`);
		}
	};

	const renderRoleCard = ({ item }) => (
		<TouchableOpacity
			style={[styles.roleCard, { backgroundColor: item.color }]}
			onPress={() => handleRolePress(item)}
			activeOpacity={0.8}
		>
			<View style={styles.iconContainer}>
				{renderIcon(item.iconType, item.icon, 32, 'white')}
			</View>
			<Text style={styles.roleTitle}>{item.title}</Text>
			<Text style={styles.roleSubtitle}>{item.subtitle}</Text>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Hope Hospital</Text>
				<Text style={styles.headerSubtitle}>Choose Your Role</Text>
			</View>

			<FlatList
				data={userRoles}
				renderItem={renderRoleCard}
				numColumns={2}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.roleGrid}
				columnWrapperStyle={styles.row}
			/>

			<View style={styles.footer}>
				<Text style={styles.footerText}>Hospital Management System</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
		paddingTop: Platform.OS === 'ios' ? 0 : 20,
	},
	header: {
		paddingVertical: 30,
		paddingHorizontal: 20,
		backgroundColor: '#6366f1',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
		alignItems: 'center',
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: '700',
		color: 'white',
		letterSpacing: 0.5,
		marginBottom: 5,
	},
	headerSubtitle: {
		fontSize: 16,
		color: '#e0e7ff',
		fontWeight: '400',
	},
	roleGrid: {
		paddingHorizontal: 15,
		paddingVertical: 20,
		flexGrow: 1,
	},
	row: {
		justifyContent: 'space-between',
		marginBottom: 15,
	},
	roleCard: {
		flex: 0.48,
		aspectRatio: 1,
		borderRadius: 20,
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
		marginBottom: 10,
	},
	iconContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: 'rgba(255,255,255,0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	roleTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: 'white',
		textAlign: 'center',
		marginBottom: 4,
		letterSpacing: 0.3,
	},
	roleSubtitle: {
		fontSize: 12,
		color: 'rgba(255,255,255,0.9)',
		textAlign: 'center',
		fontWeight: '500',
		lineHeight: 16,
	},
	footer: {
		paddingVertical: 20,
		paddingHorizontal: 20,
		alignItems: 'center',
		backgroundColor: 'white',
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
	},
	footerText: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '500',
	},
});

export default ProfileScreen;
