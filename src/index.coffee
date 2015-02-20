ko     = require 'knockout'
$      = require 'jquery'
moment = require 'moment'

class Todo
  constructor: (@text, @deadline) ->

class TodoViewModel
  constructor: () ->
    @todos = ko.observableArray()
    @text = ko.observable()
    @deadline = ko.observable()

  add: (todo, e) =>
    if @text().length is 0 or @deadline().length is 0
      return

    @todos.push(new Todo(@text(), @deadline()))
    @text("")
    @deadline()

  remove: (todo, e) =>
    @todos.remove(todo)

  printTodo: (todo) ->
    "#{todo.text} 〆 #{todo.deadline}"

$ ->
  ko.applyBindings(new TodoViewModel(), $("#todoList")[0])
