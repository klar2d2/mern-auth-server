// require neede packages
require('dotenv').config()
let express = require('express')
let cors = require('cors')
let morgan = require('morgan')
let rowdyLogger = require('rowdy-logger')
let expressJwt = require('express-jwt')

// instantiate app
let app = express()
let rowdyResults = rowdyLogger.begin(app)

// Set Up Middleware
app.use(cors())
app.use(morgan('dev'))

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '10 mb' }))

// Routes
app.use('/auth', expressJwt({
  secret: process.env.JWT_SECRET
}).unless({
  path: [
    { url: '/auth/login', methods: ['POST'] },
    { url: '/auth/signup', methods: ['POST'] }
  ]
}), require('./controllers/auth'))

app.get('/', (req, res) => {
  res.send('its ya boi')
})
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

app.listen(process.env.PORT || 3000, () => {
  rowdyResults.print()
})
