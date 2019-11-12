import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const EventSchema = new Schema({
  rsvps: [{ type: String }],
  title: { type: String },
  date: { type: String },
  time: { type: String },
  location: { type: String },
  description: { type: String },
});
EventSchema.set('toJSON', {
  virtuals: true,
});

// create EventModel class from schema
const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;
