import React, { useState } from 'react';
import {SafeAreaView,View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet,Switch} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Task = {
  id: string;
  title: string;
  status: 'due' | 'done';
};

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'due',
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const handleToggleTaskStatus = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'due' ? 'done' : 'due' }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
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
