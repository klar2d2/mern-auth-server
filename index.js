// require neede packages
let express = require('express')
let cors = require('cors')

// instantiate app
let app = express()

// Set Up Middleware
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '10 mb' }))

// Routes
app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

app.listen(processs.env.PORT || 3000 )
