
let arr = [];
// CREATE - add elements
function create(element) {
  arr.push(element);
  console.log(`${element} added!`);
}

// READ - display all elements
function read() {
  console.log("Current Array:", arr);
}

// UPDATE - update element at a given index
function update(index, newValue) {
  if (index >= 0 && index < arr.length) {
    console.log(`Updated ${arr[index]} to ${newValue}`);
    arr[index] = newValue;
  } else {
    console.log("Invalid index");
  }
}

// DELETE - remove element at a given index
function remove(index) {
  if (index >= 0 && index < arr.length) {
    console.log(`Removed: ${arr[index]}`);
    arr.splice(index, 1);
  } else {
    console.log("Invalid index");
  }
}
create("Apple");
create("Banana");
create("Cherry");
read();
update(1, "Blueberry"); 
read();
remove(0);
read();
