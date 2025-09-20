// index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- import this

interface Task {
  id: string;
  title: string;
}

export default function App() {
  const navigation = useNavigation(); // <-- get navigation
  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // <-- hide header
  }, [navigation]);

  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDark, setIsDark] = useState<boolean>(true); // default dark mode

  const addTask = () => {
    if (task.trim() === '') return;
    setTasks([...tasks, { id: Date.now().toString(), title: task }]);
    setTask('');
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: isDark ? '#fff' : '#000' }]}>Todo List</Text>
        <View style={styles.switchContainer}>
          <Text style={{ color: isDark ? '#fff' : '#000', marginRight: 8 }}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0', color: isDark ? '#fff' : '#000' },
          ]}
          placeholder="Enter a task"
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={task}
          onChangeText={setTask}
        />
        <Button title="Add" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskContainer, { borderBottomColor: isDark ? '#333' : '#eee' }]}>
            <Text style={[styles.task, { color: isDark ? '#fff' : '#000' }]}>{item.title}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <Text style={[styles.delete, { color: 'red' }]}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  taskContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  task: { fontSize: 18 },
  delete: { fontSize: 18 },
});
