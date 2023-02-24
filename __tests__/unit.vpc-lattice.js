const eventSources = require('../src/event-sources')
const testUtils = require('./utils')

const vpcLatticeEventSource = eventSources.getEventSource({
  eventSourceName: 'AMAZON_VPC_LATTICE'
})

test('request is correct', () => {
  const req = getReq()
  expect(typeof req).toEqual('object')
  expect(req.headers).toHaveProperty('accept', 'application/json')
  expect(req.method).toEqual('GET')
})

function getReq () {
  const event = testUtils.vpcLatticeEvent
  const request = vpcLatticeEventSource.getRequest({ event })
  return request
}
