ko      = require 'knockout'
moment  = require 'moment'

ToDo = require './ToDo'

class ToDoListViewModel
  DATE_FORMAT  = "M/D H:mm"

  constructor: () ->
    @text = ko.observable("")
    @isTextFocused = ko.observable(true)
    @deadline = ko.observable(moment().format(DATE_FORMAT))

    @todos = ko.observableArray()

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
    ToDo.loadAll((status, data) =>
      if status isnt 200
        console.log "load error #{data}"
        return

      @todos(data)
    )

  save: () ->
    ToDo.saveAll(@todos(), (status) ->
      if status isnt 200
        console.log "saving failed: #{status}"
    )

module.exports = ToDoListViewModel
