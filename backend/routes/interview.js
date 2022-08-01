const express = require('express');
const { body } = require('express-validator/check');

const interviewController = require('../controllers/interview');
const isAuth = require('../middleware/is-auth');
const isinterviewer = require('../middleware/isinterviewer');
const Candidate = require('../models/candidate');
const Interview = require('../models/interview');

const router = express.Router();

router.get('/feedback/:interviewerId', isAuth, async (req,res)=> {

    let candidates = [];
    Interview.find({interviewer_id: req.params.interviewerId}).then((linked_candidates) => {
        console.log(linked_candidates);

        for(let i = 0; i < linked_candidates.length ; i++){
            Candidate.findById(linked_candidates[i].candidate_id).then((usr) => {
                console.log('usr array', usr.name);
                candidates.push({
                    candidateId: usr._id,
                    name: usr.name,
                })
                console.log('candidate3' ,candidates);
            }) 
        }
        console.log('candidate1', candidates);
    }).then(() => {
        // console.log('candidate1', candidates);
    })

    // console.log(linked_candidates);

    // for(let i = 0; i < linked_candidates.length ; i++){
    //     Candidate.findById({_id : linked_candidates[i].candidate_id}).then((usr) => {
    //         console.log('usr array', usr.name);
    //         candidates.push({
    //             candidateId: usr.candidate_id,
    //             name: usr.name,
    //         })
    //     }) 
    // }
    
    // await linked_candidates.forEach((user) => {
    //     Candidate.findById({_id : user.candidate_id}).then((usr) => {
    //         console.log('usr array', usr.name);
    //         candidates.push({
    //             candidateId: user.candidate_id,
    //             name: usr.name,
    //         })
    //     })   

        
    //     // console.log(usr);
    // });

    // candidates = linked_candidates.map(a => a.candidate_id);

    console.log('candidate2', candidates); 

    res.render('interviewer/feedback');
})

router.post('/feedback/:interviewerId/:candidateId', isAuth, isinterviewer,
    [
    body('rating').trim().not().isEmpty()
    ], interviewController.addFeedback);

module.exports = router; 