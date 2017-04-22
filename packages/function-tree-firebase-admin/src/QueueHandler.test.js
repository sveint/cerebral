/* eslint-env mocha */
import {QueueHandler} from './QueueHandler'
import assert from 'assert'

describe('QueueHandler', () => {
  it('should create own authenticate function', () => {
    const queue = new QueueHandler({
      authenticate: () => {
        assert.ok(true)
      }
    })
    queue.authenticate()
  })
})
