require('dotenv').config()
const express = require('express')
const { parse } = require('url')
const next = require('next')
const passport = require('passport')
const Strategy = require('passport-twitter').Strategy

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })


const start = async () => {
  try {
    await nextApp.prepare()
    const handle = nextApp.getRequestHandler(nextApp)
  
  
  
    passport.use(new Strategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_SECRET_KEY,
      callbackURL: '/twitter/callback',
      proxy: false,
    },
    function(token, tokenSecret, profile, cb) {
      return cb(null, profile)
    }))
  
    passport.serializeUser(function(user, cb) {
      cb(null, user)
    })
  
    passport.deserializeUser(function(obj, cb) {
      
      cb(null, obj)
    })
    
  
    const expressApp = express()
    
    expressApp.use(require('cookie-parser')())
    expressApp.use(require('body-parser').urlencoded({ extended: true }))
    expressApp.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: {
      secure: 'auto',
    } }))
    expressApp.use(passport.initialize())
    expressApp.use(passport.session())
  
  
    expressApp.get('/twitter/login',
      passport.authenticate('twitter'))
  
    expressApp.get('/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        if(req.user) console.log('I have a user!!', req.user.username)
        res.redirect('/')
      })

    expressApp.get('/*', handle)
    expressApp.listen(8080)
  } catch (error) {
    console.error('well something went wrong', error)
  }
 
}


start()
