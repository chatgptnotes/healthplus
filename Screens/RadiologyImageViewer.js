import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	TextInput,
	Alert,
	Modal,
	SafeAreaView,
	Image,
	Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/ThemeColors';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RadiologyImageViewer = (props) => {
	const dispatch = useDispatch();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [showTools, setShowTools] = useState(true);
	const [brightness, setBrightness] = useState(50);
	const [contrast, setContrast] = useState(50);
	const [annotations, setAnnotations] = useState([]);
	const [showMeasurements, setShowMeasurements] = useState(false);

	// Sample study data - this would come from navigation params or Redux
	const [studyData, setStudyData] = useState({
		id: 'RAD001',
		patientName: 'Priya Sharma',
		patientId: 'P12345',
		studyType: 'Chest X-Ray',
		studyDate: '2024-01-15',
		images: [
			{
				id: '1',
				name: 'PA View',
				url: 'https://via.placeholder.com/800x600/2563eb/ffffff?text=Chest+X-Ray+PA+View',
				type: 'X-Ray',
				description: 'Posteroanterior chest radiograph'
			},
			{
				id: '2',
				name: 'Lateral View',
				url: 'https://via.placeholder.com/600x800/7c3aed/ffffff?text=Chest+X-Ray+Lateral+View',
				type: 'X-Ray',
				description: 'Lateral chest radiograph'
			},
			{
				id: '3',
				name: 'Previous Study',
				url: 'https://via.placeholder.com/800x600/059669/ffffff?text=Previous+Chest+X-Ray',
				type: 'X-Ray',
				description: 'Previous PA chest radiograph for comparison'
			}
		],
		findings: 'Clear lung fields. Normal cardiac silhouette. No acute findings.',
		impression: 'Normal chest X-ray.'
	});

	const currentImage = studyData.images[selectedImageIndex];

	const handleZoomIn = () => {
		setZoomLevel(prev => Math.min(prev + 0.25, 3));
	};

	const handleZoomOut = () => {
		setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
	};

	const handleResetView = () => {
		setZoomLevel(1);
		setBrightness(50);
		setContrast(50);
	};

	const handlePrevImage = () => {
		setSelectedImageIndex(prev => Math.max(prev - 1, 0));
		setZoomLevel(1);
	};

	const handleNextImage = () => {
		setSelectedImageIndex(prev => Math.min(prev + 1, studyData.images.length - 1));
		setZoomLevel(1);
	};

	const renderImageThumbnail = ({ item, index }) => (
		<TouchableOpacity
			style={[
				styles.thumbnail,
				selectedImageIndex === index && styles.selectedThumbnail
			]}
			onPress={() => {
				setSelectedImageIndex(index);
				setZoomLevel(1);
			}}
		>
			<Image source={{ uri: item.url }} style={styles.thumbnailImage} />
			<Text style={styles.thumbnailText}>{item.name}</Text>
		</TouchableOpacity>
	);

	const renderToolbar = () => (
		<View style={styles.toolbar}>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<TouchableOpacity style={styles.toolButton} onPress={handleZoomIn}>
					<MaterialIcons name="zoom-in" size={24} color="white" />
					<Text style={styles.toolButtonText}>Zoom In</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton} onPress={handleZoomOut}>
					<MaterialIcons name="zoom-out" size={24} color="white" />
					<Text style={styles.toolButtonText}>Zoom Out</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton} onPress={handleResetView}>
					<MaterialIcons name="refresh" size={24} color="white" />
					<Text style={styles.toolButtonText}>Reset</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton}>
					<MaterialIcons name="straighten" size={24} color="white" />
					<Text style={styles.toolButtonText}>Measure</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton}>
					<MaterialIcons name="edit" size={24} color="white" />
					<Text style={styles.toolButtonText}>Annotate</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton}>
					<MaterialIcons name="invert-colors" size={24} color="white" />
					<Text style={styles.toolButtonText}>Invert</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton}>
					<MaterialIcons name="print" size={24} color="white" />
					<Text style={styles.toolButtonText}>Print</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.toolButton}>
					<MaterialIcons name="share" size={24} color="white" />
					<Text style={styles.toolButtonText}>Share</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);

	const renderImageControls = () => (
		<View style={styles.imageControls}>
			<View style={styles.controlGroup}>
				<Text style={styles.controlLabel}>Brightness</Text>
				<View style={styles.sliderContainer}>
					<TouchableOpacity
						style={styles.sliderButton}
						onPress={() => setBrightness(prev => Math.max(prev - 10, 0))}
					>
						<MaterialIcons name="remove" size={16} color="white" />
					</TouchableOpacity>
					<View style={styles.sliderTrack}>
						<View style={[styles.sliderFill, { width: `${brightness}%` }]} />
					</View>
					<TouchableOpacity
						style={styles.sliderButton}
						onPress={() => setBrightness(prev => Math.min(prev + 10, 100))}
					>
						<MaterialIcons name="add" size={16} color="white" />
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.controlGroup}>
				<Text style={styles.controlLabel}>Contrast</Text>
				<View style={styles.sliderContainer}>
					<TouchableOpacity
						style={styles.sliderButton}
						onPress={() => setContrast(prev => Math.max(prev - 10, 0))}
					>
						<MaterialIcons name="remove" size={16} color="white" />
					</TouchableOpacity>
					<View style={styles.sliderTrack}>
						<View style={[styles.sliderFill, { width: `${contrast}%` }]} />
					</View>
					<TouchableOpacity
						style={styles.sliderButton}
						onPress={() => setContrast(prev => Math.min(prev + 10, 100))}
					>
						<MaterialIcons name="add" size={16} color="white" />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => props.navigation.goBack()}
				>
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<View style={styles.headerInfo}>
					<Text style={styles.headerTitle}>{studyData.patientName}</Text>
					<Text style={styles.headerSubtitle}>{studyData.studyType} - {studyData.studyDate}</Text>
				</View>
				<TouchableOpacity
					style={styles.toolsToggle}
					onPress={() => setShowTools(!showTools)}
				>
					<MaterialIcons name={showTools ? "visibility-off" : "visibility"} size={24} color="white" />
				</TouchableOpacity>
			</View>

			<View style={styles.mainContent}>
				{/* Image Viewer */}
				<View style={styles.imageContainer}>
					<ScrollView
						style={styles.imageScrollView}
						contentContainerStyle={styles.imageScrollContent}
						maximumZoomScale={3}
						minimumZoomScale={0.5}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
					>
						<Image
							source={{ uri: currentImage.url }}
							style={[
								styles.mainImage,
								{
									transform: [{ scale: zoomLevel }],
									opacity: brightness / 100 + 0.3,
								}
							]}
							resizeMode="contain"
						/>
					</ScrollView>

					{/* Image Navigation */}
					<View style={styles.imageNavigation}>
						<TouchableOpacity
							style={[styles.navButton, selectedImageIndex === 0 && styles.navButtonDisabled]}
							onPress={handlePrevImage}
							disabled={selectedImageIndex === 0}
						>
							<MaterialIcons name="chevron-left" size={32} color={selectedImageIndex === 0 ? "#6b7280" : "white"} />
						</TouchableOpacity>

						<View style={styles.imageInfo}>
							<Text style={styles.imageTitle}>{currentImage.name}</Text>
							<Text style={styles.imageDescription}>{currentImage.description}</Text>
							<Text style={styles.imageCounter}>
								{selectedImageIndex + 1} of {studyData.images.length}
							</Text>
						</View>

						<TouchableOpacity
							style={[styles.navButton, selectedImageIndex === studyData.images.length - 1 && styles.navButtonDisabled]}
							onPress={handleNextImage}
							disabled={selectedImageIndex === studyData.images.length - 1}
						>
							<MaterialIcons name="chevron-right" size={32} color={selectedImageIndex === studyData.images.length - 1 ? "#6b7280" : "white"} />
						</TouchableOpacity>
					</View>

					{/* Zoom Level Indicator */}
					<View style={styles.zoomIndicator}>
						<Text style={styles.zoomText}>{(zoomLevel * 100).toFixed(0)}%</Text>
					</View>
				</View>

				{/* Side Panel */}
				{showTools && (
					<View style={styles.sidePanel}>
						{/* Thumbnails */}
						<View style={styles.thumbnailsSection}>
							<Text style={styles.sectionTitle}>Images</Text>
							<FlatList
								data={studyData.images}
								renderItem={renderImageThumbnail}
								keyExtractor={item => item.id}
								numColumns={2}
								showsVerticalScrollIndicator={false}
							/>
						</View>

						{/* Image Controls */}
						{renderImageControls()}

						{/* Study Information */}
						<View style={styles.studyInfoSection}>
							<Text style={styles.sectionTitle}>Study Information</Text>
							<Text style={styles.studyInfoText}>Patient: {studyData.patientName}</Text>
							<Text style={styles.studyInfoText}>ID: {studyData.patientId}</Text>
							<Text style={styles.studyInfoText}>Study: {studyData.studyType}</Text>
							<Text style={styles.studyInfoText}>Date: {studyData.studyDate}</Text>
						</View>

						{/* Findings */}
						<View style={styles.findingsSection}>
							<Text style={styles.sectionTitle}>Report</Text>
							<ScrollView style={styles.findingsScroll}>
								<Text style={styles.findingsLabel}>Findings:</Text>
								<Text style={styles.findingsText}>{studyData.findings}</Text>
								<Text style={styles.findingsLabel}>Impression:</Text>
								<Text style={styles.impressionText}>{studyData.impression}</Text>
							</ScrollView>
						</View>
					</View>
				)}
			</View>

			{/* Toolbar */}
			{showTools && renderToolbar()}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: 'rgba(0,0,0,0.8)',
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	headerInfo: {
		flex: 1,
		marginLeft: 15,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: 'white',
	},
	headerSubtitle: {
		fontSize: 14,
		color: '#d1d5db',
		marginTop: 2,
	},
	toolsToggle: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(255,255,255,0.2)',
	},
	mainContent: {
		flex: 1,
		flexDirection: 'row',
	},
	imageContainer: {
		flex: 1,
		position: 'relative',
	},
	imageScrollView: {
		flex: 1,
	},
	imageScrollContent: {
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100%',
	},
	mainImage: {
		width: screenWidth * 0.7,
		height: screenHeight * 0.6,
	},
	imageNavigation: {
		position: 'absolute',
		bottom: 20,
		left: 0,
		right: 0,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
	},
	navButton: {
		padding: 10,
		borderRadius: 25,
		backgroundColor: 'rgba(0,0,0,0.7)',
	},
	navButtonDisabled: {
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	imageInfo: {
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.7)',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
	},
	imageTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: 'white',
	},
	imageDescription: {
		fontSize: 12,
		color: '#d1d5db',
		marginTop: 2,
		textAlign: 'center',
	},
	imageCounter: {
		fontSize: 12,
		color: '#9ca3af',
		marginTop: 5,
	},
	zoomIndicator: {
		position: 'absolute',
		top: 20,
		right: 20,
		backgroundColor: 'rgba(0,0,0,0.7)',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
	},
	zoomText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '600',
	},
	sidePanel: {
		width: screenWidth * 0.3,
		backgroundColor: 'rgba(15,23,42,0.95)',
		paddingHorizontal: 15,
		paddingVertical: 10,
	},
	thumbnailsSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: '600',
		color: 'white',
		marginBottom: 10,
	},
	thumbnail: {
		width: '48%',
		marginBottom: 10,
		marginHorizontal: '1%',
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 2,
		borderColor: 'transparent',
	},
	selectedThumbnail: {
		borderColor: '#0ea5e9',
	},
	thumbnailImage: {
		width: '100%',
		height: 60,
		backgroundColor: '#374151',
	},
	thumbnailText: {
		fontSize: 10,
		color: 'white',
		padding: 5,
		textAlign: 'center',
		backgroundColor: 'rgba(0,0,0,0.7)',
	},
	imageControls: {
		marginBottom: 20,
	},
	controlGroup: {
		marginBottom: 15,
	},
	controlLabel: {
		fontSize: 12,
		color: 'white',
		marginBottom: 8,
	},
	sliderContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	sliderButton: {
		padding: 5,
		backgroundColor: '#374151',
		borderRadius: 4,
	},
	sliderTrack: {
		flex: 1,
		height: 4,
		backgroundColor: '#374151',
		marginHorizontal: 8,
		borderRadius: 2,
	},
	sliderFill: {
		height: '100%',
		backgroundColor: '#0ea5e9',
		borderRadius: 2,
	},
	studyInfoSection: {
		marginBottom: 20,
	},
	studyInfoText: {
		fontSize: 12,
		color: '#d1d5db',
		marginBottom: 5,
	},
	findingsSection: {
		flex: 1,
	},
	findingsScroll: {
		flex: 1,
	},
	findingsLabel: {
		fontSize: 12,
		fontWeight: '600',
		color: 'white',
		marginBottom: 5,
		marginTop: 10,
	},
	findingsText: {
		fontSize: 11,
		color: '#d1d5db',
		lineHeight: 16,
	},
	impressionText: {
		fontSize: 11,
		color: '#fbbf24',
		lineHeight: 16,
		fontWeight: '500',
	},
	toolbar: {
		backgroundColor: 'rgba(15,23,42,0.95)',
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	toolButton: {
		alignItems: 'center',
		marginRight: 20,
		minWidth: 60,
	},
	toolButtonText: {
		fontSize: 10,
		color: 'white',
		marginTop: 5,
		textAlign: 'center',
	},
});

export default RadiologyImageViewer;