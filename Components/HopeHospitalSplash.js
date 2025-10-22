import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const HopeHospitalSplash = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle logo pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto finish after 3 seconds if onFinish is provided
    if (onFinish) {
      const timer = setTimeout(() => {
        onFinish();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fadeAnim, scaleAnim, logoRotateAnim, onFinish]);

  const logoScale = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: logoScale },
            ],
          },
        ]}
      >
        {/* Placeholder for logo - replace with actual Hope Hospital logo */}
        <View style={styles.logoPlaceholder}>
          <View style={styles.logoSymbol}>
            <View style={styles.redLine} />
            <View style={styles.blueLine} />
            <View style={styles.connectingLine} />
          </View>
          <Text style={styles.doctorText}>Dr. Murali's</Text>
          <View style={styles.hospitalNameContainer}>
            <Text style={styles.hopeText}>HOPE</Text>
            <Text style={styles.hospitalText}>HOSPITAL</Text>
          </View>
          <Text style={styles.taglineText}>Assured | Committed | Proficient</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading Hope Hospital Management...</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.footerText}>Powered by Hope & Ayushman Hospitals</Text>
      </Animated.View>
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
  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    width: 120,
    height: 80,
    position: 'relative',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redLine: {
    position: 'absolute',
    left: 30,
    top: 10,
    width: 8,
    height: 60,
    backgroundColor: '#dc2626',
    borderRadius: 4,
  },
  blueLine: {
    position: 'absolute',
    right: 30,
    top: 10,
    width: 8,
    height: 60,
    backgroundColor: '#1e40af',
    borderRadius: 4,
  },
  connectingLine: {
    position: 'absolute',
    top: 35,
    left: 35,
    right: 35,
    height: 8,
    backgroundColor: '#1e40af',
    borderRadius: 4,
  },
  doctorText: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Arial',
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

export default HopeHospitalSplash;