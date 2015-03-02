assert  = require 'power-assert'
moment  = require 'moment'
sinon   = require 'sinon'
request = require 'superagent'

ToDo   = require '../../src/ToDoList/ToDo'
deferred = require '../helper/deferred'

describe "ToDo", ->
  todo_example = new ToDo("test_task", "1/1 1:11")
  todo_example_json =
      text: "test_task"
      deadline: "1/1 1:11"

  it "should be able to instantiate", ->
    assert todo_example isnt null

  it "has text", ->
    assert todo_example.text is "test_task"

  it "has deadline", ->
    assert todo_example.deadline.isSame moment(Date.parse("1/1 1:11"))

  it "has not deadline string", ->
    assert typeof todo_example.deadline isnt "string"

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
      sinon.stub(request, 'get', (url, cb) ->
        ok = {ok: true, status: 200, text: JSON.stringify(todo_example_json)}
        ng = {ok: false, status: 404, text: ""}
        return deferred(() -> cb ok, () -> cb ng)
      )

    afterEach ->
      request.get.restore()

    it "call the ajax once", () ->
      ToDo.loadAll(sinon.spy()).resolve()
      assert(request.get.calledOnce)

    it "yield success", () ->
      callback = sinon.spy()
      {promise, resolve} = ToDo.loadAll(callback)
      promise.then(()->
        assert(callback.withArgs(200, [t]).calledOnce)
        done()
      )
      resolve()

    it "yield error", () ->
      callback = sinon.spy()
      {promise, reject} = ToDo.loadAll(callback)
      promise.then(()->
        assert(callback.withArgs(400).calledOnce)
        done()
      )
      reject()

  describe "save all", ->
    beforeEach ->
      sinon.stub(request, 'post', (url, data_string, cb) ->
        ok = {ok: true, status: 200}
        ng = {ok: false, status: 404}
        return deferred(() -> cb ok, () -> cb ng)
      )

    afterEach ->
      request.post.restore()

    it "call ajax at once", ->
      ToDo.saveAll(sinon.spy()).resolve()
      assert(request.post.calledOnce)

    it "yield success", () ->
      callback = sinon.spy()
      {promise, resolve} = ToDo.saveAll(callback)
      promise.then(()->
        assert(callback.withArgs(200).calledOnce)
        done()
      )
      resolve()

    it "yield error", () ->
      callback = sinon.spy()
      {promise, reject} = ToDo.saveAll(callback)
      promise.then(()->
        assert(callback.withArgs(404).calledOnce)
        done()
      )
      reject()
