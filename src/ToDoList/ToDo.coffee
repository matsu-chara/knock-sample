ko      = require 'knockout'
moment  = require 'moment'
request = require 'superagent'

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
    request
      .get(API_END_GET)
      .end((res) ->
        # application/jsonがheaderについてるなら
        # res.bodyでパース済みのものが取得できる
        data = JSON.parse(res.text)
        if res.ok
          todos = ko.utils.arrayMap(data.todos,
                    (t) -> new ToDo(t.text, t.deadline)
                  )
          callback?(res.status, todos)
        else
          callback?(res.status)
      )

  @saveAll: (todos, callback) ->
    request
      .post(API_END_POST)
      .send(JSON.stringify(todos: todos))
      .end((res) ->
        if res.ok
          callback?(res.status)
        else
          callback?(res.status)
      )

module.exports = ToDo
