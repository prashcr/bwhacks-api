const express = require('express')
const erm = require('express-restify-mongoose')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const _ = require('lodash')
const jwt = require('jwt-simple')
const secret = 'I kent stop'
const Item = require('../models/Item')
const Order = require('../models/Order')
const Vendor = require('../models/Vendor')
const User = require('../models/User')
const router = express.Router()
const ermRouter = express.Router()
const myRouter = express.Router()

erm.serve(ermRouter, Item, {totalCountHeader: true})
erm.serve(ermRouter, Order, {totalCountHeader: true})
erm.serve(ermRouter, Vendor, {totalCountHeader: true})

router.use(ermRouter)

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  (email, password, done) => {
    User.findOne({email: email}, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false)
      if (!user.verifyPassword(password)) return done(null, false)
      user.comparePassword(password, (err, isMatch) => {
        if (err) return done(err)
        if (isMatch) return (null, user)
        return done(null, user)
      })
    })
  }
))

myRouter.post('/signup', (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  })
  user.save(err => {
    if (err) return next()
    res.send(200)
  })
})

myRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.json(401, {error: 'message'})

    const token = jwt.encode({email: 'somedata'}, secret)
    res.json({token: token})
  })(req, res, next)
})

myRouter.get('/selections', (req, res, next) => {
  Item.find({}, {_id: 0}, (err, docs) => {
    if (err) return console.log(err)
    res.json(_.uniqBy(docs, 'name'))
  })
})

myRouter.get('/selections/:name', (req, res, next) => {
	Item.find({name: req.params.name}, (err, docs) => {
    if (err) return next(err)
    Vendor.paginate({items: {$in: docs.map(x => x._id.valueOf())}}, {offset: +req.query.skip, limit: +req.query.limit}, function(err, results) {
      if (err) return next(err)
      res.json(results.docs)
    })
  })
})

router.use('/api/v1', myRouter)

module.exports = router
