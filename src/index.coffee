ko     = require 'knockout'
$      = require 'jquery'

ToDoViewModel = require './ToDoViewModel'

$ ->
  ko.applyBindings(new ToDoViewModel(), $("#todoList")[0])
