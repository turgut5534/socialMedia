import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import PhoneInput from 'react-native-phone-number-input';

const RegisterPage: React.FC = () => {
  const router = useRouter(); // Use router for navigation

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');

  const phoneInput = React.useRef<PhoneInput>(null);


  const handleRegister = async () => {
    if (!firstname || !lastname || !phone || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const userData = { firstname, lastname, phone, password, repassword };

    try {
      const response = await fetch('http://155.158.140.79:8000/users/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setFirstname('')
        setLastname('')
        setPhone('')
        setPassword('')
        setRePassword('')
        Alert.alert('Success', `Welcome, ${firstname}!`);
        router.push('/login')
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Something went wrong!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error! Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstname}
        onChangeText={setFirstname}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={setLastname}
        placeholderTextColor="#888"
      />
    <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="US" // Set default country code, you can dynamically change it
        onChangeFormattedText={text => setPhone(text)} // Store the formatted phone number
        containerStyle={styles.phoneInputContainer}
        textInputStyle={styles.phoneInputText}
        codeTextStyle={styles.phoneInputCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Password Again"
        value={repassword}
        onChangeText={setRePassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <Button title="Register" onPress={handleRegister} />
      <View style={{ marginTop: 20 }} />
      <Button
        title="Already have an account? Login"
        onPress={() => router.push('/login')} // Navigate to the login page
      />
      <Button
        title="Chat"
        onPress={() => router.push('/chat')} // Navigate to the login page
      />
       <Button
        title="Profile"
        onPress={() => router.push('/profile')} // Navigate to the login page
      />
    </View>
    
  );
};

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

    export default RegisterPage;
