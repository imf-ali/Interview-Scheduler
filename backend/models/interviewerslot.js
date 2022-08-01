const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InterviewerSlotSchema = new Schema({
  interviewer_id : {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
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
            },
            available : {
              type : Boolean,
              default : true
            }
          }    
      ],
      default : []
  }
}
);

module.exports = mongoose.model('InterviewerSlot', InterviewerSlotSchema);
