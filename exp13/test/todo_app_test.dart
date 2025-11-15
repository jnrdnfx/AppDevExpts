import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:exp13/main.dart';

void main() {
  testWidgets('shows empty state text when there are no todos', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('No tasks yet!'), findsOneWidget);
  });

  testWidgets('adds a todo when user enters text and presses add', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());

    // Enter text in the TextField
    await tester.enterText(find.byKey(const Key('todo-input')), 'Buy milk');

    // Tap the add button
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump(); // rebuild after state change

    // Check if new todo appears
    expect(find.text('Buy milk'), findsOneWidget);
  });
}
