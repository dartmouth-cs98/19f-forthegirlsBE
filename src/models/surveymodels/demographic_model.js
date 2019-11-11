import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const DemographicSchema = new Schema({
  age: Number,
  high: Boolean,
  college: Boolean,
  post: Boolean,
});
// EventSchema.set('toJSON', {
//   virtuals: true,
// });

// create EventModel class from schema
const DemographicModel = mongoose.model('Demographic', DemographicSchema);

export default DemographicModel;
