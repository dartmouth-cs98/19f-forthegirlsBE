import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const MatchSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  user2: { type: Schema.Types.ObjectId, ref: 'User', index: true },
});
MatchSchema.set('toJSON', {
  virtuals: true,
});

// create EventModel class from schema
const MatchModel = mongoose.model('Match', MatchSchema);

export default MatchModel;
