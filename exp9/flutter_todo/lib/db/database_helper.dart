import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/task_model.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;
  DatabaseHelper._init();

  Future<Database> get database async {
    if (kIsWeb) {
      // Web uses SharedPreferences, no SQLite DB
      throw UnsupportedError('Use SharedPreferences for web.');
    }

    if (_database != null) return _database!;
    _database = await _initDB('tasks.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);
    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        isDone INTEGER NOT NULL
      )
    ''');
  }

  // ---------------- Web Methods ----------------
  Future<List<Task>> _getTasksFromWeb() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString('tasks');
    if (jsonString == null) return [];
    final List decoded = jsonDecode(jsonString);
    return decoded.map((t) => Task.fromMap(t)).toList();
  }

  Future<void> _saveTasksToWeb(List<Task> tasks) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(tasks.map((t) => t.toMap()).toList());
    await prefs.setString('tasks', encoded);
  }

  // ---------------- Common Methods ----------------
  Future<int> insertTask(Task task) async {
    if (kIsWeb) {
      final tasks = await _getTasksFromWeb();
      final newTask = task.copyWith(id: tasks.length + 1);
      tasks.add(newTask);
      await _saveTasksToWeb(tasks);
      return newTask.id!;
    } else {
      final db = await instance.database;
      return await db.insert('tasks', task.toMap());
    }
  }

  Future<List<Task>> getTasks() async {
    if (kIsWeb) {
      return await _getTasksFromWeb();
    } else {
      final db = await instance.database;
      final result = await db.query('tasks');
      return result.map((json) => Task.fromMap(json)).toList();
    }
  }

  Future<int> updateTask(Task task) async {
    if (kIsWeb) {
      final tasks = await _getTasksFromWeb();
      final index = tasks.indexWhere((t) => t.id == task.id);
      if (index != -1) {
        tasks[index] = task;
        await _saveTasksToWeb(tasks);
      }
      return 1;
    } else {
      final db = await instance.database;
      return await db.update(
        'tasks',
        task.toMap(),
        where: 'id = ?',
        whereArgs: [task.id],
      );
    }
  }

  Future<int> deleteTask(int id) async {
    if (kIsWeb) {
      final tasks = await _getTasksFromWeb();
      tasks.removeWhere((t) => t.id == id);
      await _saveTasksToWeb(tasks);
      return 1;
    } else {
      final db = await instance.database;
      return await db.delete(
        'tasks',
        where: 'id = ?',
        whereArgs: [id],
      );
    }
  }
}
