import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ProfileTab = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // For pull-to-refresh
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://155.158.140.79:8000/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching data.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop refreshing animation
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchUserData(); // Re-fetch the data
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('No token found');
        return;
      }

      const response = await fetch('http://155.158.140.79:8000/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await AsyncStorage.removeItem('userToken');
        router.push('/');
      }
    } catch (e) {
      console.error('Logout error', e);
      Alert.alert('Error', 'Something went wrong during logout. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Info */}
      {userData ? (
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{userData.firstname}</Text>
          <Text style={styles.phone}>{userData.phone}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Unable to load user data.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileTab;
