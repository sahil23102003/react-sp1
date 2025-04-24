import fs from 'node:fs';
import readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

const FILE_PATH = './todos.json';
let todos = loadTodos();

const rl = readline.createInterface({ input, output });

function loadTodos() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return []; // If file doesn't exist or is invalid
  }
}

function saveTodos() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
}

function showMenu() {
  console.log('\n=== To-Do List ===');
  console.log('1. View To-Do List');
  console.log('2. Add To-Do');
  console.log('3. Delete To-Do');
  console.log('4. Exit');

  rl.question('Choose an option: ', (option) => {
    switch (option.trim()) {
      case '1':
        viewTodos();
        break;
      case '2':
        addTodo();
        break;
      case '3':
        deleteTodo();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Invalid option. Try again.');
        showMenu();
    }
  });
}

function viewTodos() {
  console.log('\nYour To-Do List:');
  if (todos.length === 0) {
    console.log('No tasks yet!');
  } else {
    todos.forEach((todo, index) => {
      console.log(`${index + 1}. ${todo}`);
    });
  }
  showMenu();
}

function addTodo() {
  rl.question('Enter a new task: ', (task) => {
    const trimmed = task.trim();
    if (trimmed !== '') {
      todos.push(trimmed);
      saveTodos();
      console.log('Task added!');
    } else {
      console.log('Empty task not added.');
    }
    showMenu();
  });
}

function deleteTodo() {
  rl.question('Enter task number to delete: ', (num) => {
    const index = parseInt(num) - 1;
    if (!isNaN(index) && index >= 0 && index < todos.length) {
      const removed = todos.splice(index, 1);
      saveTodos();
      console.log(`Removed: ${removed}`);
    } else {
      console.log('Invalid task number.');
    }
    showMenu();
  });
}

showMenu();
