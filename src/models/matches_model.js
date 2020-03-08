import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema({
  user1: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  user2: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  matched: { type: Boolean },
  rejected: { type: Boolean },
  score: { type: Number },
});
MatchSchema.set('toJSON', {
  virtuals: true,
});

// create EventModel class from schema
const MatchModel = mongoose.model('Match', MatchSchema);

export default MatchModel;
