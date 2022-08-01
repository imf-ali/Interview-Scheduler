const express = require('express');
const { body } = require('express-validator/check');

const candidateController = require('../controllers/candidate');
const isAuth = require('../middleware/is-auth');
const istaexec = require('../middleware/istaexec');

const router = express.Router();

router.get('/onboardCandidate', isAuth, (req,res) => {
  // res.send('working');
  res.render('ta_exec/onboardCandidate')
})

router.post('/onboardCandidate', isAuth, istaexec,
[
  body('email').trim().isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
  body('name').trim().not().isEmpty().withMessage('Please enter name'),
  body('phone').trim().not().isEmpty().withMessage('Please enter phone'),
  body('resume_link').custom((value, { req }) => {
    // console.log(value, req.file);  
    console.log('file ',req.body)
    if (!req.file) throw new Error("Resume is required");
    return true;
  })
]
, candidateController.onboardCandidate);

router.get('/listCandidates', isAuth, candidateController.getAllCandidates);

router.get('/listInterviewers', isAuth, candidateController.getAllInterviewers);

router.get('/candidateAvailability/:candidateId', isAuth, (req,res) => {
  // res.send('working');
  res.render('candidates/updateSlot')
})

router.put('/candidateAvailability/:candidateId', isAuth, istaexec, candidateController.updateCandidateAvailability);

router.get('/interviewSchedule/:candidateId', isAuth, istaexec, candidateController.viewInterviewSchedule);

router.get('/candidateJourney/:candidateId', isAuth, istaexec, candidateController.viewCandidateJourney);

router.get('/resume/:candidateId', isAuth, istaexec, candidateController.getResume);
  
module.exports = router;