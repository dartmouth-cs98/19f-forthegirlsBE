import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const PersonalitySchema = new Schema({
  extraversion: Number,
  listening: Number,
});
// EventSchema.set('toJSON', {
//   virtuals: true,
// });

// create EventModel class from schema
const PersonalityModel = mongoose.model('Personality', PersonalitySchema);

export default PersonalityModel;
