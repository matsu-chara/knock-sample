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

  @loadAll: (callback) ->
    $.ajax(
      type: 'GET'
      url: API_END_GET
      success: (data, status, jqXHR) ->
        # dataType: 'json'を使うとnullがきた時にerrorになる。
        # サーバーで204 no contentを返すとsuccessになるらしい。
        data = JSON.parse(data)
        if status is "success"
          todos = ko.utils.arrayMap(data.todos,
                    (t) -> new ToDo(t.text, t.deadline)
                  )
          callback(todos)
        else
          callback(status)
      error: (jqXHR, status, err) ->
        callback(status)
    )

  @saveAll: (todos, callback) ->
    $.ajax(
      type: 'POST'
      url: API_END_POST
      data: JSON.stringify(todos: todos)
      success: (data, status, jqXHR) ->
        callback(status)
      error: (jqXHR, status, err) ->
        callback(status)
    )

module.exports = ToDo
