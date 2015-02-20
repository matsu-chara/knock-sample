assert = require 'power-assert'

ToDo   = require '../../src/ToDoList/ToDo'

describe "karma and mocha testing", ->
  it "isn't null", ->
    t = new ToDo("test", "1/1 1:11")
    assert.notEqual(t, null)
