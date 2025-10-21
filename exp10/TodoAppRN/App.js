import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
// Standard Firebase JS SDK (v9+ compat for better environment support)
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAgXaKatWVtPAk2oHVo9jd4hv8ZUFZZCtQ",
  authDomain: "todolistrn-e878f.firebaseapp.com",
  projectId: "todolistrn-e878f",
  storageBucket: "todolistrn-e878f.firebasestorage.app",
  messagingSenderId: "599063415703",
  appId: "1:599063415703:web:fe3864c19e63239ab0d2d2"
};
// 2. The App ID for the Firestore path will be the project ID
const appId = firebaseConfig.projectId || 'local-todo-app';
// 3. We are not using a custom auth token in this local setup
const initialAuthToken = null;
// =================================================================


// Initialize Firebase App instance holders
let app;
let firestore;
let auth;

// Flag to prevent re-initialization during fast refresh
let isFirebaseInitialized = false;

// Custom Hook to manage Firebase services and authentication state
const useFirebase = () => {
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [db, setDb] = useState(null);
  const [fbAuth, setFbAuth] = useState(null);

  useEffect(() => {
    // 1. Initialize Firebase
    // Check for required configuration before attempting initialization
    if (!isFirebaseInitialized && firebaseConfig.projectId && firebaseConfig.apiKey) {
      try {
        // Use standard JS SDK initializeApp
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app(); // Use existing app if already initialized
        }
        
        firestore = app.firestore();
        auth = app.auth();

        setDb(firestore);
        setFbAuth(auth);
        isFirebaseInitialized = true;
        console.log("Firebase initialized successfully with standard JS SDK.");
      } catch (e) {
        console.error("Firebase Initialization Error:", e);
      }
    }

    // 2. Set up Authentication Listener and Sign-In
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            // Sign in anonymously to get a persistent UID for task creation
            const userCredential = await auth.signInAnonymously();
            setUserId(userCredential.user.uid);
          } catch (error) {
            console.error('Firebase Auth Error (Anonymous Sign-in Failed):', error.message);
            // Fallback to a non-authenticated random ID if sign-in fails
            setUserId(crypto.randomUUID());
          }
        }
        setIsAuthReady(true);
      });
      return () => unsubscribe();
    } else if (firebaseConfig.projectId && firebaseConfig.apiKey) {
        // If initialization failed due to config errors or app issues, but user provided config:
        console.warn("Authentication services not available or initialized. Using fallback random ID.");
        setUserId(crypto.randomUUID());
        setIsAuthReady(true);
    } else {
        // If config is missing, show readiness but with a dummy ID
        console.error("Firebase configuration missing. Cannot connect to database.");
        setUserId('NO_CONFIG');
        setIsAuthReady(true);
        setIsLoading(false); // Stop loading since we won't connect
    }
    
  }, []);

  return { db, userId, isAuthReady, fbAuth };
};


// --- Main Application Component ---
const App = () => {
  const { db, userId, isAuthReady } = useFirebase();
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Firestore collection path (using a simple, publicly shared collection for all users)
  const tasksCollectionPath = `tasks`; 

  // READ: Real-time Listener for Tasks
  useEffect(() => {
    if (!db || !isAuthReady) return;

    // Start listening for tasks once auth is ready
    const subscriber = db
      .collection(tasksCollectionPath)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const fetchedTasks = [];
          querySnapshot.forEach(documentSnapshot => {
            fetchedTasks.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setTasks(fetchedTasks);
          setIsLoading(false);
        },
        error => {
          console.error('Error listening to tasks:', error);
          setIsLoading(false);
        }
      );

    // Stop listening on unmount
    return () => subscriber();
  }, [db, isAuthReady]);

  // CREATE: Add new task to Firestore
  const addTask = useCallback(async () => {
    if (!db || !taskInput.trim()) return;

    try {
      await db.collection(tasksCollectionPath).add({
        title: taskInput.trim(),
        completed: false,
        // Use firebase.firestore.FieldValue.serverTimestamp() from the compat library
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
        // Storing the ID of the user who created it 
        createdBy: userId, 
      });
      setTaskInput(''); // Clear input after successful add
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  }, [db, taskInput, userId]);

  // UPDATE: Toggle task completion status
  const toggleTask = useCallback(async (taskId, currentStatus) => {
    if (!db) return;

    try {
      await db.collection(tasksCollectionPath).doc(taskId).update({
        completed: !currentStatus,
      });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  }, [db]);

  // DELETE: Remove task
  const deleteTask = useCallback(async (taskId) => {
    if (!db) return;

    try {
      await db.collection(tasksCollectionPath).doc(taskId).delete();
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  }, [db]);

  // UI Renderer for individual task items
  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id, item.completed)}
      >
        <Text style={[styles.checkboxIcon, item.completed && styles.checkedIcon]}>
          {item.completed ? '✓' : ''}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.taskTitle, item.completed && styles.taskCompleted]}>
        {item.title}
      </Text>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.header}>Todo Tasks</Text>
      {/* User ID display removed for clean UI */}

      {/* Task Input Area (New Task Menu) */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="What needs to be done?"
          placeholderTextColor="#777"
          value={taskInput}
          onChangeText={setTaskInput}
          onSubmitEditing={addTask} // Allows adding task via keyboard 'Enter'
        />
        <TouchableOpacity
          style={[styles.addButton, !taskInput.trim() && styles.addButtonDisabled]}
          onPress={addTask}
          disabled={!taskInput.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Task List Area (Tasks Added/To-Be-Completed Menu) */}
      <Text style={styles.listTitle}>Tasks List (Real-time)</Text>
      <View style={styles.listContainer}>
        {isLoading && !tasks.length && isAuthReady && (
          <ActivityIndicator size="large" color="#3f51b5" style={{ marginVertical: 20 }} />
        )}
        {!isAuthReady && (
          <Text style={styles.loadingText}>Initializing Firebase...</Text>
        )}
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          ListEmptyComponent={!isLoading && isAuthReady && (
            <Text style={styles.emptyListText}>You are all caught up! ✨</Text>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

// --- Minimalist Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9de5ffff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 25, /* Adjusted margin since userIdText is gone */
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1a1a1a',
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#3f51b5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9fa8da',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3f51b5',
    marginBottom: 10,
    marginLeft: 5,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginHorizontal: 10,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  checkboxIcon: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
  checkedIcon: {
    backgroundColor: '#3f51b5',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    borderRadius: 4,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontSize: 22,
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#3f51b5',
    marginTop: 30,
    fontSize: 16,
  }
});

export default App;
