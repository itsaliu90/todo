#!/usr/bin/env node

// Please note that this tool requires node to be installed in usr/bin/env

// Require basic node.js modules
fs = require('fs');
path = require('path');

// Set up primary todos object for temporary storage 
var currentTodos;

// Get additional arguments that are passed in after the 'todo' command
var args = process.argv.slice(2);

// Set up shortcut paths
var pathToDesktop = '/Users/alexyuningliu/Desktop'
var pathToList = path.join(pathToDesktop, 'todo.json') 

// Check if todo.json exists - if it doesn't, create a new todo.json with a sample task on the desktop
if (!fs.existsSync(pathToList)) {
  fs.writeFile(pathToList, JSON.stringify({todos: [{name: "sample task"}]}));
  console.log('Created a todo.json on your Desktop!');   
}

// Read and parse todo.json and store it in the currentTodos object
fs.readFile(pathToList, 'utf8', function (err, data) {
  if (err) {
    console.log('Error reading todo.json: ', err);
  }
  currentTodos = JSON.parse(data);
  
  // Loop through the additional args and apply appropriate rules 
  switch(args[0]) {

    // If 'ls' command is typed, show all current tasks
    case 'ls':
      console.log('Here is your todo list: ');
      for (var i = 0; i < currentTodos.todos.length; i++) {
        console.log(i+1 + ": " + currentTodos.todos[i].name);
      }
      break;

    // If 'add' command is typed, expect a string argument to follow, and add a task
    case 'add':
      if (!args[1]) {
        console.log('Please include a string describing the todo after the "add" command');
        break
      }
      console.log('Adding a new todo item... ' + args[1]);
      currentTodos.todos.push({name: args[1]});
      fs.writeFile(pathToList, JSON.stringify(currentTodos), function(err) {
        if (err) {
          return console.log('Write fail for todo.json: ', err);
        } 
        console.log('Updated todo list:');
        for (var i = 0; i < currentTodos.todos.length; i++) {
          console.log(i+1 + ": " + currentTodos.todos[i].name);
        }
      })
      break;

    // If 'finish' command is typed, expect a number argument to follow
    case 'finish':
      if (!args[1] || currentTodos.todos[args[1]-1] === undefined) {
        console.log('Please include a number corresponding to the todo item to finish after the "fin" command');
        break
      }
      console.log('Finishing item ' + args[1] + "... " + currentTodos.todos[args[1]-1].name);
      currentTodos.todos.splice(args[1]-1, 1);
        fs.writeFile(pathToList, JSON.stringify(currentTodos), function(err) {
          if (err) {
            return console.log('Write fail for todo.json: ', err);
          } 
          console.log('Updated todo list: ');
          for (var i = 0; i < currentTodos.todos.length; i++) {
            console.log(i+1 + ": " + currentTodos.todos[i].name);
          }
        })
      break;
  }
})
