import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const CSSchema = new Schema({
  front: Boolean,
  back: Boolean,
  small: Boolean,
  medium: Boolean,
  large: Boolean,
  meritocratic: Boolean,
  nurturing: Boolean,
  fratty: Boolean,
  fast: Boolean,
  organized: Boolean,
  stable: Boolean,
  formal: Boolean,
  relaxed: Boolean,
  web: Boolean,
  users: Boolean,
  design: Boolean,
  mobile: Boolean,
  security: Boolean,
  algorithms: Boolean,
  storage: Boolean,
});
// EventSchema.set('toJSON', {
//   virtuals: true,
// });

// create EventModel class from schema
const CSModel = mongoose.model('CS', CSSchema);

export default CSModel;
