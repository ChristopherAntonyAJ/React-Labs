import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import app from '../../FirebaseConfig';

import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const firestore = getFirestore(app);

type Task = {
  id: string;
  title: string;
  status: 'due' | 'done';
};

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'tasks'), (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((documentSnapshot) => {
        const data = documentSnapshot.data();
        tasks.push({
          id: documentSnapshot.id,
          title: data.title,
          status: data.status,
        });
      });
      setTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle,
        status: 'due',
      };
      await addDoc(collection(firestore, 'tasks'), newTask);
      setNewTaskTitle('');
    }
  };

  const handleToggleTaskStatus = async (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedStatus = task.status === 'due' ? 'done' : 'due';
      await updateDoc(doc(firestore, 'tasks', id), { status: updatedStatus });
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteDoc(doc(firestore, 'tasks', id));
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskStatus}>{item.status === 'done' ? 'Done' : 'Due'}</Text>
      </View>
      <View style={styles.taskControls}>
        <Switch
          value={item.status === 'done'}
          onValueChange={() => handleToggleTaskStatus(item.id)}
        />
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Icon name="delete" size={24} color="#ff4757" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.title}>Todo List</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputField}
          placeholder="Enter task"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: newTaskTitle.trim() ? '#ff6348' : '#f1a5a0' },
          ]}
          onPress={handleAddTask}
          disabled={!newTaskTitle.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#d9534f',
  },
  inputWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  inputField: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  addButton: {
    width: '80%',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffe3e3',
    marginBottom: 10,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  taskStatus: {
    fontSize: 14,
    color: '#b5651d',
  },
  taskControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TodoApp;
