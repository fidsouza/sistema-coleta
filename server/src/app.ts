import express = require('express')
import cors = require('cors')
import path  from 'path'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)
app.use('/uploads' , express.static(path.resolve(__dirname, '..', 'uploads')))

export default app
