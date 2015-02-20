assert = require 'power-assert'

describe "karma and mocha testing", ->
  it "is equal to 1", ->
    assert 1 is 1

  it "is not equal to 2", ->
    assert 1 is 2
