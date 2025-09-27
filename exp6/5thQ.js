
const students = [
  { name: "Aarav", marks: 35 },
  { name: "Ishita", marks: 45 },
  { name: "Rohan", marks: 50 },
  { name: "Meera", marks: 30 }
];
const passedStudents = students
  .filter(student => student.marks >= 40)
  .map(student => student.name);

console.log(passedStudents);

