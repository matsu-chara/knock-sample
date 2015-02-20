moment = require 'moment'

class ToDo
  constructor: (@text, deadlineString) ->
    @deadline = moment(Date.parse(deadlineString))

    unless @constructor.validate(@text, deadlineString)
      console.warn "invalid ToDo object was generated."
      return

  @validate:(text, deadlineString) ->
    return false if text.length is 0
    return false if isNaN(Date.parse(deadlineString))
    return true

module.exports = ToDo
