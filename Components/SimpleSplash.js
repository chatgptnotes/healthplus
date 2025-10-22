import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SimpleSplash = ({ onFinish }) => {
  useEffect(() => {
    // Auto finish after 3 seconds
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Hope Hospital Text Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.doctorText}>Dr. Murali's</Text>
        <View style={styles.hospitalNameContainer}>
          <Text style={styles.hopeText}>HOPE</Text>
          <Text style={styles.hospitalText}>HOSPITAL</Text>
        </View>
        <Text style={styles.taglineText}>Assured | Committed | Proficient</Text>
      </View>

      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading Hope Hospital Management...</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Hope & Ayushman Hospitals</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  doctorText: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 5,
  },
  hospitalNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  hopeText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#dc2626',
    marginRight: 0,
    letterSpacing: -2,
  },
  hospitalText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1e40af',
    letterSpacing: -2,
  },
  taglineText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 150,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default SimpleSplash;