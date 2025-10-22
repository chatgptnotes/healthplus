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
  Switch,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const MorningHuddleEnhanced = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [huddleData, setHuddleData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '9:00 AM',
    attendees: [
      'Dr. Pradeep Agrawal - Managing Director',
      'Dr. Sunita Devi - Nursing Head',
      'Ramesh Kumar - Operations Manager',
      'Kavita Sharma - Quality Manager',
      'Amit Singh - Security Head'
    ],
    agenda: [
      {
        id: '1',
        title: 'Previous Day Review',
        items: [
          'Patient census and occupancy rates',
          'Critical incidents and near misses',
          'Staff attendance and leave status',
          'Equipment issues and maintenance'
        ],
        completed: false
      },
      {
        id: '2',
        title: 'Daily Operations Plan',
        items: [
          'Scheduled surgeries and procedures',
          'Expected admissions and discharges',
          'Doctor availability and on-call schedules',
          'Special requirements and preparations'
        ],
        completed: false
      },
      {
        id: '3',
        title: 'Quality & Safety Updates',
        items: [
          'NABH compliance status',
          'Infection control measures',
          'Patient safety protocols',
          'Quality improvement initiatives'
        ],
        completed: false
      },
      {
        id: '4',
        title: 'Performance Metrics',
        items: [
          'Patient satisfaction scores',
          'Average length of stay',
          'Readmission rates',
          'Financial performance indicators'
        ],
        completed: false
      },
      {
        id: '5',
        title: 'Action Items & Follow-ups',
        items: [
          'Previous action item status',
          'New issues requiring attention',
          'Resource requirements',
          'Escalation items'
        ],
        completed: false
      }
    ],
    kpis: [
      { metric: 'Bed Occupancy', value: '85%', target: '80%', status: 'above' },
      { metric: 'Patient Satisfaction', value: '4.2/5', target: '4.0/5', status: 'above' },
      { metric: 'Average LOS', value: '3.2 days', target: '3.5 days', status: 'below' },
      { metric: 'Staff Attendance', value: '92%', target: '95%', status: 'below' },
      { metric: 'Infection Rate', value: '0.8%', target: '1.0%', status: 'below' }
    ],
    criticalUpdates: [
      {
        id: '1',
        type: 'emergency',
        title: 'ICU Bed Availability',
        description: 'Only 2 ICU beds available. Monitor closely for emergency admissions.',
        priority: 'high',
        assignedTo: 'Nursing Head'
      },
      {
        id: '2',
        type: 'equipment',
        title: 'MRI Machine Maintenance',
        description: 'Scheduled maintenance from 2-4 PM today. Reschedule non-urgent scans.',
        priority: 'medium',
        assignedTo: 'Operations Manager'
      },
      {
        id: '3',
        type: 'staffing',
        title: 'Night Shift Coverage',
        description: 'Two nurses on leave. Arrange backup coverage for tonight.',
        priority: 'high',
        assignedTo: 'Nursing Head'
      }
    ],
    actionItems: [
      {
        id: '1',
        task: 'Review pharmacy inventory for critical medications',
        assignedTo: 'Pharmacy Head',
        dueDate: 'Today',
        status: 'pending'
      },
      {
        id: '2',
        task: 'Update emergency contact directory',
        assignedTo: 'Admin Manager',
        dueDate: 'Tomorrow',
        status: 'in_progress'
      },
      {
        id: '3',
        task: 'Conduct fire safety drill',
        assignedTo: 'Security Head',
        dueDate: 'This Week',
        status: 'pending'
      }
    ]
  });

  const [newActionItem, setNewActionItem] = useState({
    task: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium'
  });

  const statusColors = {
    above: '#00aa00',
    below: '#ff8800',
    critical: '#ff4444'
  };

  const priorityColors = {
    high: '#ff4444',
    medium: '#ff8800',
    low: '#00aa00'
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleAgendaItem = (agendaId) => {
    setHuddleData({
      ...huddleData,
      agenda: huddleData.agenda.map(item =>
        item.id === agendaId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const addActionItem = () => {
    if (!newActionItem.task || !newActionItem.assignedTo) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const actionItem = {
      id: Date.now().toString(),
      ...newActionItem,
      status: 'pending'
    };

    setHuddleData({
      ...huddleData,
      actionItems: [...huddleData.actionItems, actionItem]
    });

    setNewActionItem({
      task: '',
      assignedTo: '',
      dueDate: '',
      priority: 'medium'
    });
    setModalVisible(false);
  };

  const updateActionItemStatus = (id, newStatus) => {
    setHuddleData({
      ...huddleData,
      actionItems: huddleData.actionItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    });
  };

  const renderKPICard = ({ item }) => (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiMetric}>{item.metric}</Text>
      <Text style={[styles.kpiValue, { color: statusColors[item.status] }]}>
        {item.value}
      </Text>
      <Text style={styles.kpiTarget}>Target: {item.target}</Text>
      <View style={[styles.kpiIndicator, { backgroundColor: statusColors[item.status] }]} />
    </View>
  );

  const renderCriticalUpdate = ({ item }) => (
    <View style={styles.updateCard}>
      <View style={styles.updateHeader}>
        <View style={styles.updateTypeContainer}>
          <Ionicons
            name={
              item.type === 'emergency' ? 'alert-circle' :
              item.type === 'equipment' ? 'build' : 'people'
            }
            size={16}
            color={priorityColors[item.priority]}
          />
          <Text style={[styles.updateType, { color: priorityColors[item.priority] }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] }]}>
          <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.updateTitle}>{item.title}</Text>
      <Text style={styles.updateDescription}>{item.description}</Text>
      <Text style={styles.updateAssignee}>Assigned to: {item.assignedTo}</Text>
    </View>
  );

  const renderActionItem = ({ item }) => (
    <View style={styles.actionItemCard}>
      <View style={styles.actionItemHeader}>
        <Text style={styles.actionItemTask}>{item.task}</Text>
        <TouchableOpacity
          onPress={() => updateActionItemStatus(
            item.id,
            item.status === 'pending' ? 'in_progress' :
            item.status === 'in_progress' ? 'completed' : 'pending'
          )}
        >
          <Ionicons
            name={
              item.status === 'completed' ? 'checkmark-circle' :
              item.status === 'in_progress' ? 'time' : 'radio-button-off'
            }
            size={20}
            color={
              item.status === 'completed' ? '#00aa00' :
              item.status === 'in_progress' ? '#ff8800' : '#ccc'
            }
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.actionItemAssignee}>Assigned to: {item.assignedTo}</Text>
      <Text style={styles.actionItemDue}>Due: {item.dueDate}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Morning Huddle</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dateTimeSection}>
          <Text style={styles.dateText}>{huddleData.date}</Text>
          <Text style={styles.timeText}>{huddleData.time}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <FlatList
            data={huddleData.kpis}
            renderItem={renderKPICard}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.kpiContainer}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Updates</Text>
          <FlatList
            data={huddleData.criticalUpdates}
            renderItem={renderCriticalUpdate}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Agenda</Text>
          {huddleData.agenda.map((agendaItem) => (
            <View key={agendaItem.id} style={styles.agendaCard}>
              <TouchableOpacity
                style={styles.agendaHeader}
                onPress={() => toggleAgendaItem(agendaItem.id)}
              >
                <Text style={styles.agendaTitle}>{agendaItem.title}</Text>
                <Ionicons
                  name={agendaItem.completed ? 'checkmark-circle' : 'radio-button-off'}
                  size={20}
                  color={agendaItem.completed ? '#00aa00' : '#ccc'}
                />
              </TouchableOpacity>
              <View style={styles.agendaItems}>
                {agendaItem.items.map((item, index) => (
                  <View key={index} style={styles.agendaItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.agendaItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Action Items</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={huddleData.actionItems}
            renderItem={renderActionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendees</Text>
          <View style={styles.attendeesContainer}>
            {huddleData.attendees.map((attendee, index) => (
              <View key={index} style={styles.attendeeItem}>
                <Ionicons name="person-circle" size={16} color="#666" />
                <Text style={styles.attendeeText}>{attendee}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Action Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Task Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newActionItem.task}
                onChangeText={(text) => setNewActionItem({...newActionItem, task: text})}
                placeholder="Enter task description"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Assigned To *</Text>
              <TextInput
                style={styles.input}
                value={newActionItem.assignedTo}
                onChangeText={(text) => setNewActionItem({...newActionItem, assignedTo: text})}
                placeholder="Enter assignee name"
              />

              <Text style={styles.inputLabel}>Due Date</Text>
              <TextInput
                style={styles.input}
                value={newActionItem.dueDate}
                onChangeText={(text) => setNewActionItem({...newActionItem, dueDate: text})}
                placeholder="e.g., Today, Tomorrow, This Week"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={addActionItem}>
                  <Text style={styles.submitButtonText}>Add Item</Text>
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
  content: {
    flex: 1,
  },
  dateTimeSection: {
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  timeText: {
    fontSize: 14,
    color: 'white',
    marginTop: 2,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  kpiContainer: {
    paddingRight: 15,
  },
  kpiCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    minWidth: 120,
    alignItems: 'center',
    position: 'relative',
  },
  kpiMetric: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  kpiTarget: {
    fontSize: 10,
    color: '#999',
  },
  kpiIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  updateCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff8800',
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  updateTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateType: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 9,
    color: 'white',
    fontWeight: 'bold',
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
  updateAssignee: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  agendaCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agendaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  agendaItems: {
    paddingLeft: 10,
  },
  agendaItem: {
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
  agendaItemText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    lineHeight: 16,
  },
  actionItemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  actionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  actionItemTask: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  actionItemAssignee: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  actionItemDue: {
    fontSize: 11,
    color: '#888',
  },
  attendeesContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  attendeeText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
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
    maxHeight: '70%',
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

export default MorningHuddleEnhanced;