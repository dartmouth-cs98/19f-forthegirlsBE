import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const BlacklistSchema = new Schema({
  reporterID: { type: Schema.Types.ObjectId, ref: 'User' },
  reportedID: { type: Schema.Types.ObjectId, ref: 'User' },
  report: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});
BlacklistSchema.set('toJSON', {
  virtuals: true,
});

const BlacklistModel = mongoose.model('Blacklist', BlacklistSchema);

export default BlacklistModel;
