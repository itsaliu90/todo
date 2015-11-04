#!/usr/bin/env node

// Please note that this requires node to be installed in usr/bin/env

// Require modules
fs = require('fs');
path = require('path');

// Set up primary todo object for storage 
var currentTodos;

// Get arguments that are passed in
var args = process.argv.slice(2);

// Path to Desktop
var pathToDesktop = '/Users/alexyuningliu/Desktop'
var pathToList = path.join(pathToDesktop, 'todo.json') 

// Check if todo.json exists - if it doesn't, create a new file called todo.json in the Desktop

if (!fs.existsSync(pathToList)) {
  fs.writeFile(pathToList, JSON.stringify({todos: [{name: "walk dog"}]}));
  console.log('Created a todo.json on your Desktop!');   
}

// Read todo.json and store it in todo object
fs.readFile(pathToList, 'utf8', function (err, data) {
  if (err) {
    console.log('Error found: ', err);
  }
  currentTodos = JSON.parse(data);
  
  // Loop through the args and apply appropriate rules 

  switch(args[0]) {
    case 'ls':
      console.log('Here is your todo list: ');
      for (var i = 0; i < currentTodos.todos.length; i++) {
        console.log(i+1 + ": " + currentTodos.todos[i].name);
      }
      break;

    // If 'add' command is typed, expect a string argument to follow
    case 'add':
      if (!args[1]) {
        console.log('Please include a string describing the todo after the "add" command');
        break
      }
      console.log('Adding a new todo item...')
      currentTodos.todos.push({name: args[1]});
      console.log('Updated Todo List: ', currentTodos);
      fs.writeFile(pathToList, JSON.stringify(currentTodos), function(err) {
        if (err) {
          return console.log('Write fail: ', err);
        } 
        console.log('Write successful!');
      })
      break;

    // If 'fin' command is typed, expect a number argument to follow
    case 'fin':
      if (!args[1]) {
        console.log('Please include a number corresponding to the todo item to finish');
        break
      }
      console.log('Finishing item ' + args[1] + ": " + currentTodos.todos[args[1]-1].name);
      currentTodos.todos.splice(args[1]-1, 1);
       fs.writeFile(pathToList, JSON.stringify(currentTodos), function(err) {
        if (err) {
          return console.log('Write fail: ', err);
        } 
        console.log('Updated Todo List: ', currentTodos);
        })
      break;
  }
})
