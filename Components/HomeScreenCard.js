import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Colors from "../constants/ThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreenCard = (props) => {
	return (
	
		<View style={styles.Card}>
			<View style={styles.cardTop}>
				<Text style={styles.textTop}> {props.name} </Text>
			</View>
	{/* Bottom Section of the Card */}
			<View style={styles.cardBottom}>
			<View style={styles.textContainer}>
				<Text style={styles.textBottom}> {props.time} </Text>
				</View>
				<View style={styles.iconContainer}>
					<MaterialCommunityIcons
						name="dots-vertical"
						size={24}
						color="black"
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	Card: {
		height: 110,
		width: 340,
		borderRadius: 16,
		justifyContent: "center",
		backgroundColor: "white",
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
		marginVertical: 6,
	},
	cardTop: {
		flex: 1,
		marginBottom: 8,
		justifyContent: "center",
		alignItems: "flex-start",
		paddingLeft: 20,
		paddingTop: 12,
	},
	cardBottom: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		alignItems:'center',
		justifyContent: "space-between",
		backgroundColor: "#f8fafc",
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	textTop: {
		fontSize: 18,
		fontWeight: "600",
		color: '#1f2937',
		letterSpacing: 0.3,
	},
	textBottom: {
		fontSize: 14,
		fontWeight: "500",
		color: '#6b7280',
	},
	iconContainer: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: '#f3f4f6',
		alignItems: "center",
		justifyContent: "center",
	},
	textContainer: {
		alignItems: "flex-start",
		flex: 1,
	},
});

export default HomeScreenCard;
