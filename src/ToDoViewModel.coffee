ko     = require 'knockout'
moment = require 'moment'

ToDo = require './ToDo'

class ToDoViewModel
  DATE_FORMAT = "M/D H:mm"

  constructor: () ->
    @todos = ko.observableArray()
    @text = ko.observable("")
    @deadline = ko.observable(moment().format(DATE_FORMAT))

  add: () =>
    return unless ToDo.validate(@text(), @deadline())

    @todos.push(new ToDo(@text(), @deadline()))
    @text("")
    @deadline(moment().format(DATE_FORMAT))

  remove: (todo, e) =>
    @todos.remove(todo)

  printToDo: (todo) ->
    "#{todo.text} 〆 #{todo.deadline.format(DATE_FORMAT)}"

module.exports = ToDoViewModel
