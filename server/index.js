import express from 'express'
import { Nuxt, Builder } from 'nuxt'
import proxy from 'http-proxy-middleware'

import api from './api'

const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8080

app.set('port', port)

// Import API Routes
// app.use('/api', api)
app.use('/api', proxy({
    target: "http://114.215.83.139",
    pathRewrite: {
        "^/api": '/fjw/api.php?'
    }
}))
app.use((req, res, next) => {
  console.log(req.url)
    next();
})


// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
