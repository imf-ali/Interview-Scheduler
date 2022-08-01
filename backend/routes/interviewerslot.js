const express = require('express');

const interviewerslotController = require('../controllers/interviewerslot');
const isAuth = require('../middleware/is-auth');
const isinterviewer = require('../middleware/isinterviewer');

const router = express.Router();

router.get('/interviewerLanding', isAuth, isinterviewer, interviewerslotController.getAllOptions);

router.get('/slot/updateSlot/:interviewerId' , isAuth, (req, res) => {
    res.render('interviewer/updateSlot')
})

router.get('/slot/deleteSlot/:interviewerId/:slotId' , isAuth, (req, res) => {
    res.render('interviewer/deleteSlot')
})

router.get('/slot/createSlot/:interviewerId' , isAuth, (req, res) => {
    res.render('interviewer/createSlot')
})

router.post('/slot/:interviewerId', isAuth, isinterviewer, interviewerslotController.createSlot);

router.put('/slot/:interviewerId', isAuth, isinterviewer, interviewerslotController.updateSlot);

router.delete('/slot/:interviewerId/:slotId', isAuth, isinterviewer, interviewerslotController.deleteSlot);

module.exports = router; 