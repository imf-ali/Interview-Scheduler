const { validationResult } = require('express-validator/check');

const Interview = require('../models/interview');
const Candidate = require('../models/candidate');
const User = require('../models/user');
const constants = require('../constants');

  exports.addFeedback = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(constants.provideRating);
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const interviewer_id = req.params.interviewerId;
    const candidate_id = req.params.candidateId;
    const rating = req.body.rating;
    const feedback = req.body.feedback;
    let interviewer = "";
    let status = "rejected";
    if(rating>=4){
      status = "selected";
    }
    User.findById(interviewer_id)
    .then(userr => {
      if (!userr) {
        const error = new Error(constants.notFoundInterviewer);
        error.statusCode = 404;
        throw error;
      }

      interviewer = userr.name;
      return Interview.findOne({candidate_id : candidate_id, interviewer_id: interviewer_id})
    })
      .then(current => {
        if (!current) {
          const error = new Error(constants.notFoundInterview);
          error.statusCode = 404;
          throw error;
        }

        if(current.status !== constants.candidateStatus.created){
          const error = new Error(constants.feedbackAlreadyGiven);
          error.statusCode = 404;
          throw error;
        }
        
        current.rating = rating;
        current.feedback = feedback;
        current.status = status;

        return current.save();
      })
      .then(result => {
        return Candidate.findById(result.candidate_id);
      })
      .then(cand => {
        cand.log.rating = rating;
        cand.log.feedback = feedback;
        cand.log.status = status;
        cand.log.interviewer = interviewer;
        cand.log.updated_at = new Date();
        cand.status = status;
        return cand.save();
      })
      .then(result => {
        res.status(200).json({ message: constants.feedbackGiven , candidateid : result._id, status: result.status});
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
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
