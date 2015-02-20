ko     = require 'knockout'
$      = require 'jquery'
moment = require 'moment'

class Todo
  constructor: (@text, deadlineString) ->
    @deadline = moment(Date.parse(deadlineString))

    unless @constructor.validate(@text, deadlineString)
      console.warn "invalid Todo object was generated."
      return

  @validate:(text, deadlineString) ->
    return false if text.length is 0
    return false if isNaN(Date.parse(deadlineString))
    return true

class TodoViewModel
  DATE_FORMAT = "M/D H:mm"

  constructor: () ->
    @todos = ko.observableArray()
    @text = ko.observable("")
    @deadline = ko.observable(moment().format(DATE_FORMAT))

  add: () =>
    return unless Todo.validate(@text(), @deadline())

    @todos.push(new Todo(@text(), @deadline()))
    @text("")
    @deadline(moment().format(DATE_FORMAT))

  remove: (todo, e) =>
    @todos.remove(todo)

  printTodo: (todo) ->
    "#{todo.text} 〆 #{todo.deadline.format(DATE_FORMAT)}"

$ ->
  ko.applyBindings(new TodoViewModel(), $("#todoList")[0])
