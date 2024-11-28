import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from 'react-native-vector-icons'; // For message icons

interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  avatarUrl?: string;
}

const Chats: React.FC = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState<Chat[]>([]);

  // Simulate fetching chats from an API
  useEffect(() => {
    const fetchChats = () => {
      const fetchedChats: Chat[] = [
        {
          id: '1',
          name: 'John Doe',
          type: 'individual',
          participants: ['John', 'You'],
          lastMessage: 'Hey, how are you?',
          lastMessageTime: '12:45 PM',
          avatarUrl: 'https://placekitten.com/100/100',
        },
        {
          id: '2',
          name: 'Family Group',
          type: 'group',
          participants: ['Mom', 'Dad', 'You'],
          lastMessage: 'Dinner at 6?',
          lastMessageTime: '11:30 AM',
          avatarUrl: 'https://placekitten.com/101/101',
        },
        {
          id: '3',
          name: 'Jane Smith',
          type: 'individual',
          participants: ['Jane', 'You'],
          lastMessage: 'Let’s catch up later!',
          lastMessageTime: '10:20 AM',
          avatarUrl: 'https://placekitten.com/102/102',
        },
      ];

      setChats(fetchedChats);
    };

    fetchChats();
  }, []);

  const renderChatItem = ({ item }: { item: Chat }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
      >
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
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        style={styles.chatList}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chats</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888',
  },
  chatItemRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default Chats;
