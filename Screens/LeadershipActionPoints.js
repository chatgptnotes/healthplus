import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const LeadershipActionPoints = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [actionPoints, setActionPoints] = useState([
    {
      id: '1',
      title: 'Nursing Rounds Compliance',
      description: 'Ensure all nursing rounds are completed on time with proper documentation',
      category: 'nursing',
      priority: 'high',
      assignedTo: 'Nursing Head',
      dueDate: '2024-12-31',
      status: 'in_progress',
      observations: [
        'Monitor hourly rounds completion',
        'Check vital signs documentation',
        'Verify patient comfort measures'
      ]
    },
    {
      id: '2',
      title: 'Doctor Availability Schedule',
      description: 'Maintain updated doctor availability for all departments',
      category: 'medical',
      priority: 'critical',
      assignedTo: 'Medical Director',
      dueDate: '2024-12-25',
      status: 'pending',
      observations: [
        'Update emergency contact numbers',
        'Confirm on-call schedules',
        'Verify specialist availability'
      ]
    },
    {
      id: '3',
      title: 'Operations Management Review',
      description: 'Weekly review of operational efficiency and resource utilization',
      category: 'operations',
      priority: 'medium',
      assignedTo: 'Operations Manager',
      dueDate: '2024-12-28',
      status: 'completed',
      observations: [
        'Review bed occupancy rates',
        'Check equipment utilization',
        'Analyze patient flow patterns'
      ]
    },
    {
      id: '4',
      title: 'Marketing & Patient Engagement',
      description: 'Implement patient feedback system and marketing initiatives',
      category: 'marketing',
      priority: 'medium',
      assignedTo: 'Marketing Head',
      dueDate: '2024-12-30',
      status: 'in_progress',
      observations: [
        'Launch patient satisfaction surveys',
        'Develop digital marketing campaigns',
        'Improve patient communication protocols'
      ]
    },
    {
      id: '5',
      title: 'NABH Compliance Audit',
      description: 'Quarterly NABH compliance review and corrective actions',
      category: 'quality',
      priority: 'critical',
      assignedTo: 'Quality Manager',
      dueDate: '2024-12-27',
      status: 'pending',
      observations: [
        'Review patient safety protocols',
        'Check documentation compliance',
        'Verify staff training records'
      ]
    }
  ]);

  const [newActionPoint, setNewActionPoint] = useState({
    title: '',
    description: '',
    category: 'operations',
    priority: 'medium',
    assignedTo: '',
    dueDate: '',
    observations: []
  });

  const categories = [
    { key: 'all', label: 'All Categories', icon: 'grid-outline' },
    { key: 'nursing', label: 'Nursing', icon: 'medical-outline' },
    { key: 'medical', label: 'Medical', icon: 'heart-outline' },
    { key: 'operations', label: 'Operations', icon: 'settings-outline' },
    { key: 'marketing', label: 'Marketing', icon: 'megaphone-outline' },
    { key: 'quality', label: 'Quality', icon: 'shield-checkmark-outline' }
  ];

  const priorities = {
    critical: { color: '#ff4444', icon: 'alert-circle' },
    high: { color: '#ff8800', icon: 'warning' },
    medium: { color: '#ffbb00', icon: 'information-circle' },
    low: { color: '#00aa00', icon: 'checkmark-circle' }
  };

  const statusColors = {
    pending: '#ff8800',
    in_progress: '#0066cc',
    completed: '#00aa00',
    overdue: '#ff4444'
  };

  const filteredActionPoints = selectedCategory === 'all'
    ? actionPoints
    : actionPoints.filter(point => point.category === selectedCategory);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const addActionPoint = () => {
    if (!newActionPoint.title || !newActionPoint.assignedTo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const actionPoint = {
      id: Date.now().toString(),
      ...newActionPoint,
      status: 'pending',
      observations: newActionPoint.observations.filter(obs => obs.trim() !== '')
    };

    setActionPoints([...actionPoints, actionPoint]);
    setNewActionPoint({
      title: '',
      description: '',
      category: 'operations',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      observations: []
    });
    setModalVisible(false);
  };

  const updateActionPointStatus = (id, newStatus) => {
    setActionPoints(actionPoints.map(point =>
      point.id === id ? { ...point, status: newStatus } : point
    ));
  };

  const renderActionPoint = ({ item }) => (
    <View style={styles.actionPointCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.actionTitle}>{item.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorities[item.priority].color }]}>
            <Ionicons name={priorities[item.priority].icon} size={12} color="white" />
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.actionDescription}>{item.description}</Text>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Assigned to: {item.assignedTo}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Due: {item.dueDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="folder-outline" size={16} color="#666" />
          <Text style={styles.detailText}>Category: {item.category}</Text>
        </View>
      </View>

      {item.observations.length > 0 && (
        <View style={styles.observationsSection}>
          <Text style={styles.observationsTitle}>Key Observations:</Text>
          {item.observations.map((obs, index) => (
            <View key={index} style={styles.observationItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.observationText}>{obs}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#0066cc' }]}
              onPress={() => updateActionPointStatus(item.id, 'in_progress')}
            >
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#00aa00' }]}
              onPress={() => updateActionPointStatus(item.id, 'completed')}
            >
              <Text style={styles.actionButtonText}>Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leadership Action Points</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Ionicons
              name={category.icon}
              size={16}
              color={selectedCategory === category.key ? '#fff' : '#666'}
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.key && styles.selectedCategoryChipText
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredActionPoints}
        renderItem={renderActionPoint}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Action Point</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={newActionPoint.title}
                onChangeText={(text) => setNewActionPoint({...newActionPoint, title: text})}
                placeholder="Enter action point title"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newActionPoint.description}
                onChangeText={(text) => setNewActionPoint({...newActionPoint, description: text})}
                placeholder="Enter detailed description"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Assigned To *</Text>
              <TextInput
                style={styles.input}
                value={newActionPoint.assignedTo}
                onChangeText={(text) => setNewActionPoint({...newActionPoint, assignedTo: text})}
                placeholder="Enter assignee name"
              />

              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={newActionPoint.dueDate}
                onChangeText={(text) => setNewActionPoint({...newActionPoint, dueDate: text})}
                placeholder="YYYY-MM-DD"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={addActionPoint}>
                  <Text style={styles.submitButtonText}>Add Action Point</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryFilter: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  selectedCategoryChip: {
    backgroundColor: '#007AFF',
  },
  categoryChipText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  actionPointCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  cardDetails: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  observationsSection: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  observationsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  observationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  bulletPoint: {
    fontSize: 12,
    color: '#666',
    marginRight: 6,
    marginTop: 1,
  },
  observationText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 0,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LeadershipActionPoints;