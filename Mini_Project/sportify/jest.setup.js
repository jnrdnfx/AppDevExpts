import 'react-native-gesture-handler/jestSetup';
import React from 'react';

// AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Firebase Auth
jest.mock('firebase/auth', () => ({
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  getAuth: jest.fn(() => ({
    currentUser: {
      uid: 'test-uid',
      email: 'test@example.com',
    },
  })),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: { uid: 'mock-uid-123', email: 'test@example.com' }
    })
  ),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));

// Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(),
}));

// Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({ params: {} }),
}));

// Safe Area
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: ({ children }) =>
      React.createElement('View', null, children),
    SafeAreaProvider: ({ children }) =>
      React.createElement('View', null, children),
    useSafeAreaInsets: () => ({
      top: 0, bottom: 0, left: 0, right: 0
    }),
  };
});

// Ionicons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
