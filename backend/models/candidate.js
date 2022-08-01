const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constants = require('../constants');

const CandidateSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum : constants.candidateStatus,
    default: constants.candidateStatus.created
  },
  resume_link: {
    type: String,
    required: true
  },
  availablility_slots: {
    type : 
    [
      {
        starttime : {
          type : Date
        },
        endtime : {
          type : Date
        }
      }    
  ],
    default: []
  },
  interview : {
      type: Schema.Types.ObjectId,
      ref: 'Interview',
  },
  log : {
      name: {
        type: String
      },
      email: {
        type: String,
        lowercase: true,
      },
      phone: {
        type: Number
      },
      status: {
        type: String,
        enum: constants.candidateStatus,
        default: constants.candidateStatus.created
      },
      slot : {
        type : 
        [
          {
            starttime : {
              type : Date
            },
            endtime : {
              type : Date
            }
          }    
      ],
        default: []
      },
      created_at : {
        type : Date
      },
      updated_at : {
        type : Date
      },
      interviewer : {
        type : String
      },
      interview_slot : {
        starttime : {
          type : Date
        },
        endtime : {
          type : Date
        }
      },
      feedback : {
        type : String
      },
      rating : {
        type : Number
      }
    }
},

  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
);

module.exports = mongoose.model('Candidate', CandidateSchema);
