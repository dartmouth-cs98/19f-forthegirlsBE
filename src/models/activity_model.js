import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const ActivitySchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  allLogins: [{ type: Date }],
  lastLogin: { type: Date, default: Date.now() },
  dayStreak: { type: Number, default: 1 },
});
ActivitySchema.set('toJSON', {
  virtuals: true,
});

const ActivityModel = mongoose.model('Activity', ActivitySchema);

export default ActivityModel;
