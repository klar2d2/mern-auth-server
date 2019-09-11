// require neede packages
let express = require('express')
let cors = require('cors')
let morgan = require('morgan')

// instantiate app
let app = express()

// Set Up Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '10 mb' }))

// Routes
app.use('/aut', require('./controllers/auth'))

app.get('/', (req, res) => {
  res.send('its ya boi')
})
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

app.listen(process.env.PORT || 3000)
