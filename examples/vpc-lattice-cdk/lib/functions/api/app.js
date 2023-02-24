// const express = require('@vendia/serverless-express')
const express = require('../../../../../')
const api = require('./api')

exports.handler = express({ app: api })
