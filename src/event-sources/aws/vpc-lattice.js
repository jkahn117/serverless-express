const url = require('url')
const { getEventBody, getCommaDelimitedHeaders } = require('../utils')

/**
{
    "body": "",
    "headers": {
        "accept": "*\/*",
        "accept-encoding": "gzip, deflate",
        "content-length": "0",
        "user-agent": "HTTPie/3.2.1",
        "x-foo": "bar,baz",
        "x-forwarded-for": "10.0.80.237"
    },
    "is_base64_encoded": false,
    "method": "PATCH",
    "query_string_parameters": {
        "foo": "bar"
    },
    "raw_path": "/foo/bar/baz?foo=bar&foo=baz"
}
 */

function getRequestValuesFromVpcLatticeEvent ({ event }) {
  const {
    method,
    raw_path: rawPath,
    is_base64_encoded: isBase64Encoded,
    query_string_parameters: queryStringParams
  } = event

  const path = url.format({
    pathname: rawPath,
    searchParams: new URLSearchParams(queryStringParams)
  })

  const headers = {}
  Object.entries(event.headers).forEach(([headerKey, headerValue]) => {
    headers[headerKey.toLowerCase()] = headerValue
  })

  let body

  if (event.body) {
    body = getEventBody({ event })
    headers['content-length'] = Buffer.byteLength(body, isBase64Encoded ? 'base64' : 'utf8')
    body = event.body
  }

  return {
    method,
    headers,
    body,
    remoteAddress: event.headers['x-forwarded-for'],
    path
  }
};

function getResponseToVpcLattice ({
  statusCode,
  body,
  headers = {},
  isBase64Encoded = false
}) {
  const responseToVpcLattice = {
    statusCode,
    body,
    isBase64Encoded
  }

  // const cookies = headers['set-cookie'];
  // if (cookies) {
  //   responseToVpcLattice.cookies = Array.isArray(cookies) ? cookies : [ cookies ];
  //   delete headers['set-cookie'];
  // }
  responseToVpcLattice.headers = getCommaDelimitedHeaders({ headersMap: headers })

  return responseToVpcLattice
}

module.exports = {
  getRequest: getRequestValuesFromVpcLatticeEvent,
  getResponse: getResponseToVpcLattice
}
