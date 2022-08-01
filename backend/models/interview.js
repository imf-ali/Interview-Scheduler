const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../constants');

const InterviewSchema = new Schema({
  candidate_id: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    index: true
  },
  interviewer_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  interview_slot: {
    type : 
      {
        starttime : {
          type : Date
        },
        endtime : {
          type : Date
        }
      }
  },
  rating: {
    type: Number,
    enum: [1,2,3,4,5],
  },
  feedback: {
    type: String,
    default: constants.feedbackNA
  },

  status : {
      type: String,
      enum: constants.interviewStatus,
      default: constants.interviewStatus.created
  }
}
);

module.exports = mongoose.model('Interview', InterviewSchema);
