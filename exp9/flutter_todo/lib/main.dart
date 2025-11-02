import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:sqflite_common_ffi_web/sqflite_ffi_web.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Detect platform and initialize appropriate database factory
  if (kIsWeb) {
    // For Flutter Web
    databaseFactory = databaseFactoryFfiWeb;
  } else if (Platform.isAndroid || Platform.isIOS) {
    // Mobile - default sqflite works fine
  } else {
    // Windows, macOS, Linux
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }

  runApp(const TodoApp());
}

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Todo App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: const Color(0xFFF4F5F7),
      ),
      home: const HomeScreen(),
    );
  }
}
