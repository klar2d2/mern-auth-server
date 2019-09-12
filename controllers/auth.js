require('dotenv').config()
let jwt = require('jsonwebtoken')
let router = require('express').Router()
let db = require('../models')

// POST /auth/login (find and validate user; send token/refresh)
router.post('/login', (req, res) => {
  //Check if the User exists by their email in the database
  db.User.findOne({ email: req.body.email })
  .then(user => {
    if (!user || !user.password) {
      return res.status(404).send({ message: 'User not found' })
    }

    // Yay - we got a user. Let's check thier password
    if(!user.isAuthenticated(req.body.password)) {
      //Invalid Credentials: wrong password
      return res.status(406).send({ message: 'Not Acceptable: Invalid Credentials' })
    }

    let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24
    })
    res.send({ token })
  })
  .catch(err => {
    console.log('Error in POST /auth/login', err)
    res.status(503).send({ message: 'Something wrong, prob DB related or you made a typo' })
  })
})

// POST to /auth/signup (create user; generate token )
router.post('/signup', (req, res) => {
  db.User.findOne({ email: req.body.email })
  .then(user => {
    //if the user exists do not let them creaate a duplicate account
    if(user) {
      return res.status(409).send({ message: 'Email aaddress in use' })
    }
    //good - they dont exist
    db.User.create(req.body)
    .then(newUser => {
      // We created a user, let's make them a shiney new token!
      let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 //24 hours in seconds
      })

      res.send({ token })
    })
    .catch(err => {
      console.log('Error when creating new user', err)
      res.status(500).send({ message: 'Error Creating user'})
    })
  })
  .catch(err => {
    console.log('Error in POST /auth/signup', err)
    res.status(503).send({ message: 'Something wrong, prob DB related or you made a typo' })
  })
})

//NOTE user should be loggied  in to acces this route
router.get('/current/user', (req, res) => {
  // the user is logged in so req.user should have data
  if (!req.user || !req.user._id) {
    return res.status(417).send({ message: 'Expectation failed: Check configuration'})
  }

  //NOTE : this is the user data from the time the token was issued
  //Warning: if you update the user info those changes will not be reflected here
  // To avoid this, reissue a token when you update user data
  res.send({ user: req.user })
})

module.exports= router
