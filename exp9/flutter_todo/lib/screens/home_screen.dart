import 'package:flutter/material.dart';
import '../models/task_model.dart';
import '../db/database_helper.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _controller = TextEditingController();
  late Future<List<Task>> _taskList;

  @override
  void initState() {
    super.initState();
    _refreshTaskList();
  }

  void _refreshTaskList() {
    setState(() {
      _taskList = DatabaseHelper.instance.getTasks();
    });
  }

  Future<void> _addTask(String title) async {
    if (title.trim().isEmpty) return;
    await DatabaseHelper.instance.insertTask(Task(title: title));
    _controller.clear();
    _refreshTaskList();
  }

  Future<void> _toggleDone(Task task) async {
    await DatabaseHelper.instance.updateTask(
      Task(id: task.id, title: task.title, isDone: task.isDone == 0 ? 1 : 0),
    );
    _refreshTaskList();
  }

  Future<void> _deleteTask(int id) async {
    await DatabaseHelper.instance.deleteTask(id);
    _refreshTaskList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F5F7),
      appBar: AppBar(
        title: const Text('Todo List'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
        elevation: 1,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // Input Field
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Enter new task...',
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding:
                          const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () => _addTask(_controller.text),
                  style: ElevatedButton.styleFrom(
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(16),
                    backgroundColor: Colors.blueAccent,
                  ),
                  child: const Icon(Icons.add, color: Colors.white),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Task List
            Expanded(
              child: FutureBuilder<List<Task>>(
                future: _taskList,
                builder: (context, snapshot) {
                  if (!snapshot.hasData) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (snapshot.data!.isEmpty) {
                    return const Center(
                      child: Text(
                        "No tasks yet. Add one!",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    );
                  }
                  return ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      final task = snapshot.data![index];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: ListTile(
                          leading: Checkbox(
                            value: task.isDone == 1,
                            onChanged: (_) => _toggleDone(task),
                            activeColor: Colors.blueAccent,
                          ),
                          title: Text(
                            task.title,
                            style: TextStyle(
                              decoration: task.isDone == 1
                                  ? TextDecoration.lineThrough
                                  : null,
                              color: task.isDone == 1 ? Colors.grey : Colors.black,
                              fontSize: 16,
                            ),
                          ),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete, color: Colors.redAccent),
                            onPressed: () => _deleteTask(task.id!),
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
