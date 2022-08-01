const User = require('../models/user');
const InterviewerSlot = require('../models/interviewerslot');
const Candidate = require('../models/candidate');
const Interview = require('../models/interview');
const constants = require('../constants');

const io = require('../socket');

exports.getOperations = (req, res, next) => {
    const userId = req.userId;
    User.findById(userId)
      .then(user => {
        if (!user) {
          const error = new Error(constants.notFoundUser);
          error.statusCode = 404;
          throw error;
        }
        
        if (user.type === "ta_exec") {
            res.status(200).json({ message: constants.taexecOperations });
        }
        else if (user.type === "interviewer") {
            res.status(200).json({ message: constants.interviewerOperations });
        }
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.schedule = (req, res, next) => {
    const interviewerslots = [];
    const candidateslots = [];
    const falseslot = [];
    const interData = [];
    const lastslot = [];
    let today = new Date();
    
    InterviewerSlot.find()
    .then(interviewerData => {
    if (!interviewerData) {
      const error = new Error('Error extracting interviewer');
      error.statusCode = 404;
      throw error;
    }

    for(let i=0;i<interviewerData.length;i++){
      for(let j=0;j<interviewerData[i].availablility_slots.length;j++){
        if(interviewerData[i].availablility_slots[j].starttime>today 
          && interviewerData[i].availablility_slots[j].available === true){
          interviewerslots.push({
            interviewer_id : interviewerData[i].interviewer_id,
            slot : interviewerData[i].availablility_slots[j]
          });
        }
      }
    }
    
    interviewerslots.sort((a,b) => a.slot.starttime - b.slot.starttime);
    return Candidate.find().sort('created_at');
  })
  .then(candidateData => {
    if (!candidateData) {
      const error = new Error('Error extracting interviewer');
      error.statusCode = 404;
      throw error;
    }

    for(let i=0;i<candidateData.length;i++){
      let curr = new Date();
      for(let j=0;j<candidateData[i].availablility_slots.length;j++){

        if(candidateData[i].status === "created" ){
          if(candidateData[i].availablility_slots[j].starttime > curr){
            curr = candidateData[i].availablility_slots[j].starttime;
          }
  
          
          if(candidateData[i].availablility_slots[j].starttime>today){
            
            candidateslots.push({
              candidate_id : candidateData[i]._id,
              slot : candidateData[i].availablility_slots[j]
            });
  
            }
        }
      }
      if(candidateData[i].status === "created" ){
        lastslot.push({candidate_id : candidateData[i]._id, finalslot : curr});
      }
    } 

    const candiCheck = new Set();
    let cand_id = null, k=-1, newcurr = new Date();
    for(let i=0;i<candidateslots.length;i++){
      
      if(!candidateslots[i].candidate_id.equals(cand_id)){

        if(i!=0 && !candiCheck.has(candidateslots[i-1].candidate_id)){
          if(+newcurr === +lastslot[k].finalslot){
            io.getIO().emit('Alert', {
              msg: 'Candidate was not scheduled',
              candidate_id : lastslot[k].candidate_id
            });
          }
        }

        k++;
        newcurr = new Date();
        cand_id = candidateslots[i].candidate_id;
      }

      if(candidateslots[i].slot.starttime > newcurr){
        newcurr = candidateslots[i].slot.starttime;
      }

      for(let j=0;j<interviewerslots.length;j++){
        if(!candiCheck.has(candidateslots[i].candidate_id) && interviewerslots[j].slot.available){
          if(candidateslots[i].slot.starttime.getDate() === interviewerslots[j].slot.starttime.getDate() 
            && candidateslots[i].slot.starttime.getTime() === interviewerslots[j].slot.starttime.getTime()
            && candidateslots[i].slot.endtime.getDate() === interviewerslots[j].slot.endtime.getDate()
            && candidateslots[i].slot.endtime.getTime() === interviewerslots[j].slot.endtime.getTime()){

              interData.push({
                candidate_id : candidateslots[i].candidate_id,
                interviewer_id: interviewerslots[j].interviewer_id,
                interview_slot: candidateslots[i].slot
              });
              falseslot.push({
                interviewer_id: interviewerslots[j].interviewer_id,
                slot_id: interviewerslots[j].slot._id
              })
              interviewerslots[j].slot.available = false;  
              candiCheck.add(candidateslots[i].candidate_id);
              break;
            }          
        }
      }
  }
  let i = candidateslots.length;
  if(!candiCheck.has(candidateslots[i-1].candidate_id)){
    if(+newcurr === +lastslot[k].finalslot){
      io.getIO().emit('Alert', {
        msg: 'Candidate was not scheduled',
        candidate_id : lastslot[k].candidate_id
      });
    }
  }
  })
  .then(result => {
    function save(data) {
      return new Promise((resolve, reject) => {
        const interview = new Interview({
          candidate_id: data.candidate_id,
          interviewer_id: data.interviewer_id,
          interview_slot : data.interview_slot,
        });
        interview.save((err, saved) => {
          if (err) {
            reject(err);
          }
    
          resolve(saved);
        });
      });
    }

    async function saveAll() {
      const promises = interData.map(data => save(data));
      const responses = await Promise.all(promises);
    }
    
    return saveAll();
  })
  .then(result => {
    function change(data) {
      return new Promise((resolve, reject) => {
        InterviewerSlot.findOne({interviewer_id : data.interviewer_id})
        .then(idata => {
          if (!idata) {
            const error = new Error('Could not find candidate.');
            error.statusCode = 404;
            throw error;
          }
          for(let i=0;i<idata.availablility_slots.length;i++){
            if(data.slot_id.equals(idata.availablility_slots[i]._id)){ 
              idata.availablility_slots[i].available = false;
              break;
            }
          }
          return idata.save();
        });
      });
    }

    async function changeSlot() {
      const promises = falseslot.map(data => change(data));
      const responses = await Promise.all(promises);
    }
    changeSlot();
  })
  .then(result => {
    function updateState(data) {
      return new Promise((resolve, reject) => {
        Candidate.findById(data.candidate_id)
        .then(cdata => {
          if (!cdata) {
            const error = new Error('Could not find candidate.');
            error.statusCode = 404;
            throw error;
          }
          cdata.status = "scheduled";
          return cdata.save();
        })
      });
    }

    async function updateCandidateState() {
      const promises = interData.map(data => updateState(data));
      const responses = await Promise.all(promises); 
    }
     updateCandidateState();
     return Interview.find();
  })
  .then(linkWithCand => {
    if (!linkWithCand) {
      const error = new Error('Error extracting interviewer');
      error.statusCode = 404;
      throw error;
    }
    function linker(data) {
      return new Promise((resolve, reject) => {
        Candidate.findById(data.candidate_id)
        .then(cdata => {
          if (!cdata) {
            const error = new Error('Could not find candidate.');
            error.statusCode = 404;
            throw error;
          }
          cdata.interview = data._id;
          cdata.log.interview_slot = data.interview_slot;
          cdata.log.updated_at = new Date();
          cdata.log.status = "scheduled";
          return cdata.save();
        })
      });
    }

    async function linkWithCandidate() {
      const promises = linkWithCand.map(data => linker(data));
      const responses = await Promise.all(promises);  
    }
     linkWithCandidate();
     res.render('schedule');
    //  res.status(200).json({ message: 'Interviews scheduled ' });
  })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };