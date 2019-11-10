import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const BasicSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  username: String,
  password: String,
});
// EventSchema.set('toJSON', {
//   virtuals: true,
// });

// create EventModel class from schema
const BasicModel = mongoose.model('Basic', BasicSchema);

export default BasicModel;
