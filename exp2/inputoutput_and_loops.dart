import 'dart:io';

void main() {
  // INPUT
  stdout.write("Enter your name: ");
  String? name = stdin.readLineSync(); // read input as string
  print("Hello, $name!");

  // FOR LOOP
  print("\nFor loop (1 to 5):");
  for (int i = 1; i <= 5; i++) {
    print("Number: $i");
  }

  // WHILE LOOP
  print("\nWhile loop (countdown from 5):");
  int count = 5;
  while (count > 0) {
    print("Countdown: $count");
    count--;
  }

  // DO-WHILE LOOP
  print("\nDo-while loop (runs at least once):");
  int num = 0;
  do {
    print("Number is $num");
    num++;
  } while (num < 3);
}
