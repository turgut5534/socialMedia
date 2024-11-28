import React, { useState, useCallback  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ChatList = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState('');
  const [chats, setChats] = useState([
    // Initial chat data
    {
      id: '1',
      name: 'John Doe',
      avatarUrl: 'https://via.placeholder.com/50',
      lastMessage: 'Hey there!',
      lastMessageTime: '10:30 AM',
    },
  ]);

  const fetchChat = async() => {

    try {

      const token = await AsyncStorage.getItem('userToken');
      
      const response = await fetch('http://155.158.140.79:8000/contact/list', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
      
        // Assuming `data.contacts` is an array of contacts from the API
        const newChats = data.contacts.map((contact, index) => ({
          id: (chats.length + index + 1).toString(), // Ensure unique IDs
          name: `${contact.contactUser.firstname} ${contact.contactUser.lastname}` || `User ${contact.contactUser.phone}`, // Use contact info or fallback to phone
          avatarUrl: contact.avatarUrl || 'https://via.placeholder.com/50', // Fallback avatar if not provided
          lastMessage: 'New chat added!',
          lastMessageTime: new Date().toLocaleTimeString(),
        }));
      
        // Update the state with the new chats
        setChats([...chats, ...newChats]);
      }
      

    } catch(e) {
      console.log(e)
    }

}

    useFocusEffect(useCallback(() =>{
        fetchChat()
      }, [])
    )
  // Function to add a new chat
  const addChat = async () => {
    
    const token = await AsyncStorage.getItem('userToken');

    const data = {
      phone: number
    }

    const response = await fetch('http://155.158.140.79:8000/contact/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    });

    if(!response.ok) {

      const data = await response.json()
      Alert.alert(''+ data.message)
    } else {
      fetchChat()
      setNumber('');
      setModalVisible(false);
    }

  };

  return (
    <View style={styles.container}>
      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem}>
            <View style={styles.chatItemLeft}>
              {/* Avatar */}
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </View>
            <View style={styles.chatItemRight}>
              {/* Time */}
              <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Chat</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a number"
              keyboardType="numeric"
              value={number}
              onChangeText={setNumber}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={addChat}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatItemLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  chatItemRight: {
    justifyContent: 'center',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatList;
