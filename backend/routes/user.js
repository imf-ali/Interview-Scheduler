const express = require('express');
const hbs = require('hbs');
const path = require('path');
const { body } = require('express-validator/check');
const constants = require('../constants');

const User = require('../models/user');
const userController = require('../controllers/user');

const candidateController = require('../controllers/candidate');
const isAuth = require('../middleware/is-auth');
const istaexec = require('../middleware/istaexec');

const router = express.Router();

router.get('/signup' , (req, res) => {
  // res.send(201)
  res.render('signup')
  // res.send({
  //   name: 'Fahad',
  //   Job: 'SDE'
  // })
})

router.get('/login' , (req, res) => {
  // res.send(201)
  res.render('login')
})

// router.post('/signup',(req,res) => {
//   console.log(req.body);

//   res.redirect('../../')
// })

router.put(
  '/signup',
  [ 
    body('email').trim()
      .isEmail().withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      }).normalizeEmail(),
    body('password').trim().isLength({ min: 5 }).withMessage('Please enter a password with atleast 5 characters.'),
    body('name').trim().not().isEmpty().withMessage('Please enter name.'),
    body('type').notEmpty().matches(constants.userType.ta_exec).withMessage('Only ta_exec type is allowed')
  ],
  userController.signup
);

router.post('/login', 
body('email').trim()
.isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
body('password').trim().isLength({ min: 5 }), 
userController.login);

router.post('/logout', userController.logout);

router.get('/ta_landing', isAuth, (req,res) => {
  res.render('ta_exec/taHome')
})

router.get('/onboardInterviewer', isAuth, (req,res) => {
  res.render('ta_exec/onboardInterviewer')
})

router.post('/onboardInterviewer', isAuth, istaexec,
[
    body('email').trim().isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
    body('phone').trim().not().isEmpty()
  ]
, candidateController.onboardInterviewer);

router.delete('/:userId', isAuth, istaexec, candidateController.deleteUser);

module.exports = router;
