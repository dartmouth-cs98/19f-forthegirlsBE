import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const SurveySchema = new Schema({
  basic: { type: Schema.Types.ObjectId, ref: 'Basic' },
  cs: { type: Schema.Types.ObjectId, ref: 'CS' },
  demographic: { type: Schema.Types.ObjectId, ref: 'Demographic' },
  education: { type: Schema.Types.ObjectId, ref: 'Education' },
  personality: { type: Schema.Types.ObjectId, ref: 'Personality' },
});
// EventSchema.set('toJSON', {
//   virtuals: true,
// });

// create EventModel class from schema
const SurveyModel = mongoose.model('Survey', SurveySchema);

export default SurveyModel;
