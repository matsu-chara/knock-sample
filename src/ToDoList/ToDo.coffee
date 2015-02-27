$      = require 'jquery'
ko     = require 'knockout'
moment = require 'moment'

class ToDo
  API_END_GET  = "http://localhost:9090/todos.json"
  API_END_POST = "http://localhost:9090/save.php"

  constructor: (@text, deadlineString) ->
    @deadline = moment(Date.parse(deadlineString))

    unless @constructor.validate(@text, deadlineString)
      console.warn "invalid ToDo object was generated."
      return

  @validate:(text, deadlineString) ->
    return false if text.length is 0
    return false if isNaN(Date.parse(deadlineString))
    return true

  @loadAll: () ->
    d = new $.Deferred
    $.getJSON(API_END_GET, (data) ->
      todos = ko.utils.arrayMap(data.todos,
                (t) -> new ToDo(t.text, t.deadline)
              )
      d.resolve(todos)
    )
    return d.promise()

  @saveAll: (ts) ->
    d = new $.Deferred
    $.post(API_END_POST, JSON.stringify(todos: ts),
      (data, status) ->
        if status is "success"
          d.resolve()
        else
          d.reject(status)
    )
    return d.promise()

module.exports = ToDo
