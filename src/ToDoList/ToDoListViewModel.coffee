ko         = require 'knockout'
moment     = require 'moment'
$          = require 'jquery'

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
    $.ajax(
      type: "GET"
      url: API_END_GET
      datatype: "json"
    ).done((todos) =>
      d = ko.utils.arrayMap(
        JSON.parse(todos).todos, (t) -> new ToDo(t.text, t.deadline)
      )
      @todos(d)
    ).fail( ->
      console.warn "no data"
    )

  save: () =>
    $().ajax(
      type: "POST"
      url: API_END_POST
      datatype: "json"
      data: JSON.stringify(todos :@todos())
      success: (data) ->
      error: () -> console.warn "update failed"
    )

module.exports = ToDoListViewModel
