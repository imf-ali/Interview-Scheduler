const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Candidate = require('../models/candidate');
const InterviewerSlot = require('../models/interviewerslot');
const Interview = require('../models/interview');
const constants = require('../constants');

exports.onboardInterviewer = (req, res, next) => {
console.log('here');
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(constants.validationError);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  let type = "interviewer", active = true;
  if(req.body.type)
  type = req.body.type;
  if(req.body.active)
  active = req.body.active;
  
  bcrypt
  .hash(password, 12)
  .then(hashedPw => {
    const user = new User({
      email: email,
      name: name,
      password: hashedPw,
      phone: phone,
      type: type,
      active: active
    });
    return user.save();
  })
    .then(result => {
      res.status(201).json({
        message: constants.onboardedInterviewer,
        userId: result._id
      });
      
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getAllCandidates = async (req, res, next) => {
  const candidates = await Candidate.find();
  console.log(candidates);
  // const x = candidates[0].email;
  res.render('candidates/allCandidates',{
    candidates
  })
  // res.send('Success');
}

exports.getAllInterviewers = async (req, res, next) => {
  const users = await User.find();
  console.log(users);

  const candidates = users.filter((user) => user.type === 'interviewer')
  // const x = candidates[0].email;
  res.render('candidates/allInterviewers',{
    candidates
  })
  // res.send('Success');
}

exports.deleteUser = (req, res, next) => {
  const userId = req.params['userId'];
  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error(constants.notFoundUser);
        error.statusCode = 404;
        throw error;
      }
      if (user.type !== constants.userType.interviewer) {
        const error = new Error(constants.removeOnlyInterviewer);
        error.statusCode = 403;
        throw error;
      }
      return User.findByIdAndRemove(userId);
    })
    .then(result => {
      return InterviewerSlot.deleteOne({interviewer_id : userId});
    })
    .then(result => {
      res.status(200).json({ 
          message: constants.deletedUser,
          userId: userId
          });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.onboardCandidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(constants.validationError);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  console.log(req.body);
  console.log(req.file);
  
  const email = req.body.email;
  const name = req.body.name;
  const phone = req.body.phone;
  const resume_link = req.file.path;
  let availablility_slots = [];
  let log = {};
  log.email = email;
  log.name = name;
  log.phone = phone;

  Candidate.findOne({email:email})
    .then(candidate => {
      if (candidate) {
        const error = new Error(constants.candidateAlreadyOnboarded);
        error.statusCode = 404;
        throw error;
      }
      if (!req.file) {
        const error = new Error(constants.noResume);
        error.statusCode = 422;
        throw error;
      }

      if(req.body.slot){
        presentSlot = JSON.parse(req.body.slot);
        for(let i = 0; i < presentSlot.length; i++) {
          availablility_slots = presentSlot;
          availablility_slots[i].starttime = new Date(presentSlot[i].starttime);
          availablility_slots[i].endtime = new Date(presentSlot[i].endtime);
        }
      }
      log.slot = availablility_slots;
      log.created_at = new Date();
      log.updated_at = new Date();

      const candidate_new = new Candidate({
        email: email,
        name: name,
        phone: phone,
        resume_link: resume_link,
        availablility_slots: availablility_slots,
        log: log
      });
      return candidate_new.save();
  
  })
    .then(result => {
      res.status(201).json({
        message: constants.onboardedCandidate,
        candidate: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateCandidateAvailability = (req, res, next) => {
  const candidateId = req.params.candidateId;
  console.log(candidateId);
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(constants.validationError);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const availablility_slots = req.body.slot;
  for(let i = 0; i < availablility_slots.length; i++) {
    availablility_slots[i].starttime = new Date(availablility_slots[i].starttime);
    availablility_slots[i].endtime = new Date(availablility_slots[i].endtime);
  }
  Candidate.findById(candidateId)
    .then(candidate => {
      if (!candidate) {
        const error = new Error(constants.notFoundCandidate);
        error.statusCode = 404;
        throw error;
      }
      if(candidate.status === constants.candidateStatus.scheduled){
        const error = new Error(constants.cannotUpdateAfterScheduled);
        error.statusCode = 403;
        throw error;
      }
      
      candidate.log.slot = availablility_slots;
      candidate.log.updated_at = new Date();
      candidate.availablility_slots = availablility_slots;
      return candidate.save();
    })
    .then(result => {
      res.status(200).json({ message: constants.candidateSlotUpdated, slot: result.availablility_slots });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.viewInterviewSchedule = (req, res, next) => {
  const candidateId = req.params.candidateId;
  const info = {slot : {}};

  Interview.findOne({ candidate_id : candidateId})
    .then(interviewData => {
      if (!interviewData) {
        const error = new Error(constants.notScheduledCandidateInterview);
        error.statusCode = 404;
        throw error;
      }
      info.slot = interviewData.interview_slot;
      res.status(200).render('candidates/schedule',{ 
        message: constants.interviewScheduled,
        info : info
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.viewCandidateJourney = (req, res, next) => {
  const candidateId = req.params.candidateId;
  let info;
  Candidate.findById(candidateId)
  .then(cand => {
    if (!cand) {
      const error = new Error(constants.notFoundCandidate);
      error.statusCode = 404;
      throw error;
    }
    info = cand.log;
    console.log(info);
    res.status(200).render('candidates/candidateJourney',{ 
      message: constants.candidateJourney,
      info : info
    });
  })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getResume = (req, res, next) => {
  const candidateId = req.params.candidateId;
  console.log('rom here');
  Candidate.findById(candidateId)
  .then(cand => {
    if (!cand) {
      const error = new Error(constants.notFoundCandidate);
      error.statusCode = 404;
      throw error;
    }
    const resume_link = cand.resume_link;
    res.download(resume_link);
  })
    .catch(err => {
      console.log('from here');
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};