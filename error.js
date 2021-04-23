'use strict'

function notFound(request, response) {
  console.log('Not Found')
  response.status(404).send('Not Found')
}

module.exports = notFound;