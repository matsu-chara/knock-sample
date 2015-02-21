assert = require 'power-assert'
sinon  = require 'sinon'

ToDo              = require '../../src/ToDoList/ToDo'
ToDoListViewModel = require '../../src/ToDoList/ToDoListViewModel'

describe "ToDoListViewModel", ->
  t = new ToDoListViewModel()

  it "has empty task", ->
    assert t.todos().length is 0

  describe "add task", ->
    afterEach () ->
      t.todos([])

    it "can add task", ->
      t.text("test_task")
      t.deadline("1/1 1:11")
      t.add()
      assert t.todos().length is 1

    it "can't add task with invalid params", ->
      t.text("")
      t.deadline("invalid string")
      t.add()
      assert t.todos().length is 0

    describe "remove", ->
      it "remove task", ->
        t.text("test_task")
        t.deadline("1/1 1:11")
        t.add()
        t.remove(t.todos()[0])
        assert t.todos().length is 0

    describe "print", ->
      it "return string", ->
        assert typeof t.printToDo(new ToDo("test_task", "1/1 1:11")) is "string"

    describe "IsTextFocused", ->
      it "set isTextFocused property", ->
        t.setIsTextFocused()
        assert t.isTextFocused()

      it "turns true when add todo", ->
        t.text("test_task")
        t.deadline("1/1 1:11")
        t.add()
        assert t.isTextFocused()

      it "turns true when add todo failing", ->
        t.text("")
        t.deadline("invalid string")
        t.add()
        assert t.isTextFocused()

    describe "get and post json", ->
      it "get todos", ->
        # no test

      it "save todos", ->
        # no test
