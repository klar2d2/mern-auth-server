let router = require('express').Router()

router.post('/login', (req, res) => {
  res.send('STUB - POST /auth/login')
})

router.post('/signup', (req, res) => {
  res.send('STUB - POST /auth/signup')
})

//NOTE user should be loggied  in to acces this route
router.get('/current/user', (req, res) => {
  res.send('STUB CUrrent USer DAta')
})

module.exports= router
