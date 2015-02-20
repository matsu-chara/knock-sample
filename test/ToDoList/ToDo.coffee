assert = require 'power-assert'
moment = require 'moment'

ToDo   = require '../../src/ToDoList/ToDo'

describe "ToDo", ->
  t = new ToDo("test_task", "1/1 1:11")

  it "should be able to instantiate", ->
    assert t isnt null

  it "has text", ->
    assert t.text is "test_task"

  it "has deadline", ->
    assert t.deadline.isSame moment(Date.parse("1/1 1:11"))

  it "has not deadline string", ->
    assert typeof t.deadline isnt "string"

  it "validate parmeter", ->
    assert ToDo.validate("test_task", "1/1 1:11") is true

  it "invalid empty text", ->
    assert ToDo.validate("", "1/1 1:11") is false

  it "invalid non-date string", ->
    assert ToDo.validate("test_task", "invalid string") is false

  it "can generate (wrongful) instance by invalid parameter", ->
    assert new ToDo("", "invalid string") isnt null
