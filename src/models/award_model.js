import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const AwardSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  rsvpThree: { type: Boolean, default: false },
  messageThree: { type: Boolean, default: false },
  firstMatch: { type: Boolean, default: false },
  sentMessageGoal: { type: Boolean, default: false },
  firstEventAdded: { type: Boolean, default: false },
});
AwardSchema.set('toJSON', {
  virtuals: true,
});

const AwardModel = mongoose.model('Award', AwardSchema);

export default AwardModel;
