import app from './app'
import http from 'http'
const normalizePort = require('normalize-port')


const port = normalizePort(process.env.PORT || '3333')

const server = http.createServer(app)
server.listen(port)