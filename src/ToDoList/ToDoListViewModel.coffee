ko              = require 'knockout'
moment          = require 'moment'
request_promise = require 'request-promise'

ToDo = require './ToDo'

class ToDoListViewModel
  DATE_FORMAT  = "M/D H:mm"
  API_END_GET  = "http://localhost:9090/todos.json"
  API_END_POST = "http://localhost:9090/save.php"

  constructor: () ->
    @text = ko.observable("")
    @isTextFocused = ko.observable(true)
    @deadline = ko.observable(moment().format(DATE_FORMAT))

    @todos = ko.observableArray()
    @load()

  add: () =>
    @setIsTextFocused()
    return unless ToDo.validate(@text(), @deadline())

    @todos.push(new ToDo(@text(), @deadline()))
    @text("")
    @deadline(moment().format(DATE_FORMAT))

  remove: (todo, e) =>
    @todos.remove(todo)

  printToDo: (todo) ->
    "#{todo.text} 〆 #{todo.deadline.format(DATE_FORMAT)}"

  setIsTextFocused: () =>
    @isTextFocused(true)

  load: () =>
    request_promise.get(
      url: API_END_GET
      json: true
    )
    .then (data) =>
      d = ko.utils.arrayMap(
        data.todos, (t) -> new ToDo(t.text, t.deadline)
      )
      @todos(d)

  save: () =>
    request_promise.post(
      url: API_END_POST
      json: true
      form: JSON.stringify(todos :@todos())
    )
    .catch () -> console.log "failed saving todos"

module.exports = ToDoListViewModel
