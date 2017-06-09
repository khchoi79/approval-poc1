'use strict'

let log = require('./logger')('consul')

const options = {
  host: process.env.CONSUL_HOST,
  port: process.env.CONSUL_PORT,
  promisify: true
}

log.debug('Initialize consul with options', options)
let consul = require('consul')(options)

exports.updateNodeMeta = function (nodeName, args) {
  return consul.catalog.node.services(nodeName).then((data) => {
    log.debug('Old service definition', data)
    log.debug('Old node data', JSON.stringify(data.Node, '', 2))
    data.Node.NodeMeta = {
      Build: args.revisionId,
      Status: args.status
    }
    return consul.catalog.register(data.Node)
  })
}
