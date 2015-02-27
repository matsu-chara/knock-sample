assert = require 'power-assert'
moment = require 'moment'
sinon  = require 'sinon'
$      = require 'jquery'

ToDo   = require '../../src/ToDoList/ToDo'

describe "ToDo", ->
  t = new ToDo("test_task", "1/1 1:11")
  t_obj =
      text: "test_task"
      deadline: "1/1 1:11"

  it "should be able to instantiate", ->
    assert t isnt null

  it "has text", ->
    assert t.text is "test_task"

  it "has deadline", ->
    assert t.deadline.isSame moment(Date.parse("1/1 1:11"))

  it "has not deadline string", ->
    assert typeof t.deadline isnt "string"

  it "can generate (wrongful) instance by invalid parameter", ->
    assert new ToDo("", "invalid string") isnt null

  describe "@validate", ->
    it "validate parmeter", ->
      assert ToDo.validate("test_task", "1/1 1:11") is true

    it "invalid empty text", ->
      assert ToDo.validate("", "1/1 1:11") is false

    it "invalid non-date string", ->
      assert ToDo.validate("test_task", "invalid string") is false

  describe "load all", ->
    beforeEach ->
      @callback = sinon.spy()
      sinon.stub($, 'ajax', (options) ->
        d = $.Deferred()
        if options.success?
          d.done(options.success(JSON.parse(todos: t_obj), "success"))

        if options.error?
          d.fail(options.error(null, "error"))
        return d
      )

    afterEach ->
      $.ajax.restore()

    it "call the ajax once", () ->
      ToDo.loadAll(@callback).resolve()
      assert($.ajax.calledOnce)

    it "yield success", () ->
      ToDo.loadAll(@callback).resolve()
      assert(@callback.withArgs([t]).calledOnce)

    it "yield error", () ->
      ToDo.loadAll(@callback).reject()
      assert(@callback.withArgs("error").calledOnce)

  describe "save all", ->
    beforeEach ->
      @callback = sinon.spy()
      sinon.stub($, 'ajax', (options) ->
        d = $.Deferred()
        if options.success?
          d.done(options.success(null, "success"))

        if options.error?
          d.fail(options.error(null, "error"))
        return d
      )

    afterEach ->
      $.ajax.restore()

    it "call ajax at once", ->
      ToDo.saveAll(@callback).resolve()
      assert($.ajax.calledOnce)

    it "yield success", () ->
      ToDo.loadAll(@callback).resolve()
      assert(@callback.withArgs("success").calledOnce)

    it "yield error", () ->
      ToDo.loadAll(@callback).reject()
      assert(@callback.withArgs("error").calledOnce)
