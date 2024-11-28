import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  // States to hold the input values
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const phoneInput = React.useRef<PhoneInput>(null);

  const router = useRouter()

  const handleLogin = async () => {
    // Basic validation
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone number and password');
      return;
    }
  
    // Prepare the data to be sent in the POST request
    const loginData = {
      phone,
      password,
    };
  
    try {
      // Send POST request to the server for login (replace with your actual backend URL)
      const response = await fetch('http://155.158.140.79:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Save the token (or any other necessary data) to AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
  
        console.log(data.token)
        // Navigate to the chat page
        router.push('/profile');
      } else {
        // Handle error response
        const errorText = await response.text(); // To handle non-JSON responses
        const errorData = errorText ? JSON.parse(errorText) : {};
        Alert.alert('Error', errorData.message || 'Login failed! Please check your credentials.');
      }
    } catch (error) {
      // Handle network errors
      console.error(error);
      Alert.alert('Error', 'Network error! Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email Field */}
      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="US" // Set default country code, you can dynamically change it
        onChangeFormattedText={text => setPhone(text)} // Store the formatted phone number
        containerStyle={styles.phoneInputContainer}
        textInputStyle={styles.phoneInputText}
        codeTextStyle={styles.phoneInputCode}
      />
      {/* Password Field */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Link to Register Page */}
      <Button
        title="Go to Register"
        onPress={() => router.push('/')} // Navigate to Register screen
      />

      <View style={{ marginTop: 20 }} />
    </View>
  );
};

// Style for the Login Page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  phoneInputContainer: {
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  phoneInputText: {
    height: 50,
    fontSize: 16,
  },
  phoneInputCode: {
    fontSize: 16,
  },
});

export default LoginPage;
