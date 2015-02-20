ko     = require 'knockout'
$      = require 'jquery'
fs     = require 'fs'

ko.components.register('todo-list',
  viewModel: require './ToDoList/ToDoListViewModel'
  template: fs.readFileSync("#{__dirname}/ToDoList/ToDoList.html", 'utf8')
)

$ ->
  ko.applyBindings()
