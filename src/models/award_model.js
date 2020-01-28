import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const AwardSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  rsvpThree: Boolean,
  messageThree: Boolean,
  firstMatch: Boolean,
});
AwardSchema.set('toJSON', {
  virtuals: true,
});

const AwardModel = mongoose.model('Award', AwardSchema);

export default AwardModel;
