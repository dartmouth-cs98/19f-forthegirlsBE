import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const EducationSchema = new Schema({
  highName: String,
  collegeName: String,
  gradYear: String,
  job: String,
});
// EventSchema.set('toJSON', {
//   virtuals: true,
// });

// create EventModel class from schema
const EducationModel = mongoose.model('Education', EducationSchema);

export default EducationModel;
