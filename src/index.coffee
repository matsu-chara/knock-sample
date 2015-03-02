ko     = require 'knockout'
fs     = require 'fs'

ko.components.register('todo-list',
  viewModel: require './ToDoList/ToDoListViewModel'
  template: fs.readFileSync("#{__dirname}/ToDoList/ToDoList.html", 'utf8')
)

window.addEventListener 'DOMContentLoaded', ->
  ko.applyBindings()
