const InterviewerSlot = require('../models/interviewerslot');
const constants = require('../constants');
const { ExplainVerbosity } = require('mongodb');
const Interview = require('../models/interview');
const Candidate = require('../models/candidate');

exports.createSlot = (req, res, next) => {
    const interviewer_id = req.params.interviewerId;

    const availablility_slots = req.body.slot;
    InterviewerSlot.findOne({interviewer_id : interviewer_id})
    .then(present => {
      if(present){
        const error = new Error(constants.useUpdate);
        error.statusCode = 404;
        throw error;
      }
    
    const days = [];
    for(let i = 0; i < availablility_slots.length; i++) {
      availablility_slots[i].starttime = new Date(availablility_slots[i].starttime);
      availablility_slots[i].endtime = new Date(availablility_slots[i].endtime);
    
      let currstart = availablility_slots[i].starttime;
      let currend = availablility_slots[i].endtime;

      days.push({starttime : currstart, endtime : currend});

      // for(let j=0;j<( 6 - currstart.getDay() );j++){
      //   days.push({
      //     starttime : new Date(currstart.getTime() + (j+1) * (24 * 60 * 60 * 1000)),
      //     endtime : new Date(currend.getTime() + (j+1) * (24 * 60 * 60 * 1000))
      //   });
      // }
    }
    const interviewerslot = new InterviewerSlot({
      interviewer_id: interviewer_id,
      availablility_slots: days
    });
    return interviewerslot.save();
  })
  .then( result => {
    res.status(200).json({ 
      message: constants.slotCreated , slots: result.availablility_slots
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

  exports.updateSlot = (req, res, next) => {
    const interviewer_id = req.params.interviewerId;
    const availablility_slots = req.body.slot;

    const days = [];
    for(let i = 0; i < availablility_slots.length; i++) {
      availablility_slots[i].starttime = new Date(availablility_slots[i].starttime);
      availablility_slots[i].endtime = new Date(availablility_slots[i].endtime);
    
      let currstart = availablility_slots[i].starttime;
      let currend = availablility_slots[i].endtime;

      days.push({starttime : currstart, endtime : currend});

      for(let j=0;j<( 6 - currstart.getDay() );j++){
        days.push({
          starttime : new Date(currstart.getTime() + (j+1) * (24 * 60 * 60 * 1000)),
          endtime : new Date(currend.getTime() + (j+1) * (24 * 60 * 60 * 1000))
        });
      }
    }

    InterviewerSlot.findOne({interviewer_id : interviewer_id})
    .then(slot => {
      if (!slot) {
        const error = new Error(constants.notFoundSlot);
        error.statusCode = 404;
        throw error;
      }
      slot.availablility_slots = days;
      return slot.save();
    })
    .then(result => {
      res.status(200).json({ message: constants.slotUpdated , slot : result.availablility_slots});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  };


  exports.deleteSlot = (req, res, next) => {
    const interviewer_id = req.params.interviewerId;
    const slot_id = req.params.slotId;
    console.log(interviewer_id, 'hello');
    InterviewerSlot.findOne({interviewer_id : interviewer_id})
      .then(slot => {
        if (!slot) {
          const error = new Error('Could not find slot.');
          error.statusCode = 404;
          throw error;
        }
        const filteredSlot = slot.availablility_slots.filter(
          (item) => item._id.toString() !== slot_id);
          
          console.log('a ',filteredSlot);
          console.log('b ', slot.availablility_slots);
          slot.availablility_slots = filteredSlot;
          return slot.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Deleted slot.' , slot : result.availablility_slots });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.getAllOptions = async (req,res) => {
    console.log(req.userId);
    const slot = await InterviewerSlot.findOne({interviewer_id: req.userId});
    // const schedule = await Interview.find({interviewer_id: req.userId});

    // let candidates = [];


    // async function apnaLoop(){
    //   for(let i = 0; i < schedule.length ; i++){
    //     Candidate.findById(schedule[0].candidate_id).then((usr) => {
    //         console.log('usr array', usr.name);
    //         candidates.push({
    //             candidateId: usr._id,
    //             name: usr.name,
    //         })
    //         console.log('candidate3' ,candidates);
    //     }) 
    //   }
    //   console.log('here', candidates);
    // };

    // apnaLoop();
    
    
    

    const slottime = slot ? slot : undefined;
    // const slottime = {
    //   starttime: slot.availablility_slots[0].starttime,
    //   endtime: slot.availablility_slots[0].endtime
    // }
    // console.log(slot.availablility_slots[0].starttime);
    // const slotPresent = slot ? true : false;

    res.render('interviewer/interviewerLanding',{
      interviewerId: req.userId,
      slottime
    });
  }