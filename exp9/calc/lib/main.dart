import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:intl/intl.dart';

// 1. DATA MODEL
// Defines the structure for a stored calculation.
class Calculation {
  final int? id;
  final String expression;
  final double result;
  final DateTime timestamp;

  Calculation({this.id, required this.expression, required this.result, required this.timestamp});

  // Convert a Calculation object into a Map for the database
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'expression': expression,
      'result': result,
      'timestamp': timestamp.toIso8601String(),
    };
  }

  // Convert a Map from the database into a Calculation object
  factory Calculation.fromMap(Map<String, dynamic> map) {
    return Calculation(
      id: map['id'],
      expression: map['expression'],
      result: map['result'],
      timestamp: DateTime.parse(map['timestamp']),
    );
  }
}

// 2. DATABASE HELPER CLASS
// Manages database connection and CRUD operations using the Singleton pattern.
class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._privateConstructor();
  static Database? _database;

  DatabaseHelper._privateConstructor();

  // Getter for the database instance
  Future<Database> get database async {
    if (_database != null) return _database!;
    // Initialize the database if it hasn't been already
    _database = await _initDatabase();
    return _database!;
  }

  // Initialize the database connection
  Future<Database> _initDatabase() async {
    // Get the standard database location for the platform (iOS/Android)
    final databasePath = await getDatabasesPath();
    final path = join(databasePath, 'calculator_history.db');

    // Open the database or create it if it doesn't exist
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  // Create the database table schema
  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE calculations(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expression TEXT NOT NULL,
        result REAL NOT NULL,
        timestamp TEXT NOT NULL
      )
    ''');
  }

  // Insert a new calculation record
  Future<int> insertCalculation(Calculation calc) async {
    final db = await database;
    return await db.insert('calculations', calc.toMap(), conflictAlgorithm: ConflictAlgorithm.replace);
  }

  // Retrieve the calculation history, ordered by timestamp (latest first)
  Future<List<Calculation>> getCalculations() async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'calculations',
      orderBy: 'timestamp DESC',
      limit: 10, // Show last 10 calculations
    );

    return List.generate(maps.length, (i) {
      return Calculation.fromMap(maps[i]);
    });
  }

  // Delete a specific calculation from history
  Future<void> deleteCalculation(int id) async {
    final db = await database;
    await db.delete(
      'calculations',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}

// 3. FLUTTER APPLICATION
void main() {
  // CRITICAL: Ensure widget binding is initialized before running the app
  // and before any database calls (like inside initState).
  WidgetsFlutterBinding.ensureInitialized();
  
  // For mobile (Android/iOS), no special factory initialization is required.
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Simple Calculator',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 5,
          ),
        ),
      ),
      home: const CalculatorScreen(),
    );
  }
}

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({super.key});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  final TextEditingController _num1Controller = TextEditingController();
  final TextEditingController _num2Controller = TextEditingController();
  String _result = "Enter numbers and calculate";
  List<Calculation> _history = [];

  @override
  void initState() {
    super.initState();
    _loadHistory(); // Load history when the screen initializes
  }

  // Function to fetch history from the database
  Future<void> _loadHistory() async {
    try {
      final history = await DatabaseHelper.instance.getCalculations();
      if (mounted) {
        setState(() {
          _history = history;
        });
      }
    } catch (e) {
      // Handle potential DB errors
      print('Error loading history: $e');
    }
  }

  // Function to delete an item and reload history
  Future<void> _deleteCalculation(int id) async {
    await DatabaseHelper.instance.deleteCalculation(id);
    _loadHistory();
  }
  
  // Set input fields from history item
  void _loadFromHistory(Calculation calc) {
    // Parse the expression string, e.g., "12.0 + 3.0"
    final parts = calc.expression.split(' ');
    if (parts.length >= 3) {
      _num1Controller.text = parts[0];
      _num2Controller.text = parts[2];
      setState(() {
        _result = "Ready for operation on: ${parts[0]} and ${parts[2]}";
      });
    }
  }

  // UPDATED: _calculate function to save the result to SQLite
  void _calculate(String operation) async {
    // 1. Get and parse input
    final num1Str = _num1Controller.text;
    final num2Str = _num2Controller.text;
    double num1 = double.tryParse(num1Str) ?? 0;
    double num2 = double.tryParse(num2Str) ?? 0;
    double res;
    String newResultText;
    bool isError = false;

    // 2. Perform calculation
    switch (operation) {
      case '+':
        res = num1 + num2;
        break;
      case '-':
        res = num1 - num2;
        break;
      case '*':
        res = num1 * num2;
        break;
      case '/':
        if (num2 == 0) {
          newResultText = "Error: Division by zero";
          isError = true;
          res = double.nan; // Set result to NaN for error state
          break;
        }
        res = num1 / num2;
        break;
      default:
        res = 0;
    }

    // 3. Update UI
    if (!isError) {
      newResultText = "Result: ${res.toStringAsFixed(2)}";
      
      // 4. Save to database only if successful
      try {
        final expression = "$num1Str $operation $num2Str";
        final newCalculation = Calculation(
          expression: expression,
          result: res,
          timestamp: DateTime.now(),
        );
        await DatabaseHelper.instance.insertCalculation(newCalculation);
        await _loadHistory(); // Refresh the history list
      } catch (e) {
        print("Database error: $e");
      }
    } else {
      newResultText = res == double.nan ? "Error: Division by zero" : "Result: 0.00";
    }

    setState(() {
      _result = newResultText;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Simple Calculator"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Input Fields
            TextField(
              controller: _num1Controller,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: "Enter first number",
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _num2Controller,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                labelText: "Enter second number",
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10))),
              ),
            ),
            const SizedBox(height: 24),

            // Operation Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildOperationButton('+', Colors.blue),
                _buildOperationButton('-', Colors.blue),
                _buildOperationButton('*', Colors.blue),
                _buildOperationButton('/', Colors.blue),
              ],
            ),
            const SizedBox(height: 30),

            // Result Display
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.blue.shade200),
              ),
              child: Text(
                _result,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: _result.startsWith("Error") ? Colors.red.shade700 : Colors.blue.shade800,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 40),
            
            // HISTORY SECTION
            const Text(
              "Calculation History (Last 10) - Tap to Reload",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w600, color: Colors.black87),
              textAlign: TextAlign.start,
            ),
            const Divider(height: 20, thickness: 1),

            // History List
            ..._history.map((calc) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  child: ListTile(
                    contentPadding: const EdgeInsets.only(left: 16, right: 8, top: 4, bottom: 4),
                    title: Text(
                      '${calc.expression} = ${calc.result.toStringAsFixed(2)}',
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                    subtitle: Text(
                      '${DateFormat('MMM d, hh:mm a').format(calc.timestamp)}',
                      style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.redAccent, size: 20),
                      onPressed: () => _deleteCalculation(calc.id!),
                    ),
                    onTap: () => _loadFromHistory(calc),
                  ),
                ),
              );
            }).toList(),
            
            if (_history.isEmpty)
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Center(
                  child: Text(
                    "No calculations saved yet.",
                    style: TextStyle(color: Colors.grey.shade500),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  // Helper method for consistent button styling
  Widget _buildOperationButton(String operation, Color color) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 5.0),
        child: ElevatedButton(
          onPressed: () => _calculate(operation),
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            foregroundColor: Colors.white,
          ),
          child: Text(operation, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
