import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { AuthContext } from '../contexts/AuthProvider';
import { useRouter } from 'expo-router';
import app from '@/firebase';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const images = [
    require('../../assets/images/img1.jpg'),
    require('../../assets/images/img2.jpg'),
    require('../../assets/images/img3.jpg'),
  ];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/profile' as never)}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/ffffff/user.png' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        <Text style={styles.appNameText}>Image Viewer</Text>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome,</Text>
        <Text style={styles.username}>{user?.displayName || 'User'} 👋</Text>
      </View>

      {/* Image Carousel */}
      <Text style={styles.sectionTitle}>View Your Images</Text>
      <Text style={{ color: '#4b4b4bff', marginBottom: 10 }}>Swipe to explore</Text>
      <Carousel
        width={screenWidth * 0.9}
        height={200}
        autoPlay
        autoPlayInterval={3000}
        data={images}
        scrollAnimationDuration={800}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image source={item} style={styles.carouselImage} resizeMode="cover" />
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cee6ffff',
    paddingTop: 50,
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  appNameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000ff',
    marginRight: 80,
    marginBottom: 2,
  },
  profileIcon: {
    width: 30,
    height: 30,
    tintColor: '#000000ff',
  },
  logoutText: {
    color: '#f05454',
    fontWeight: '600',
  },
  header: {
    width: '90%',
    marginBottom: 30,
  },
  welcome: {
    fontSize: 20,
    color: '#000000ff',
  },
  username: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000ff',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000127ff',
    marginBottom: 15,
    width: '90%',
  },
  carouselItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
});
