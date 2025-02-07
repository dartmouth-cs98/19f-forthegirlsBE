import mongoose, { Schema } from 'mongoose';

const EventSchema = new Schema({
  authorID: { type: Schema.Types.ObjectId, ref: 'User' },
  rsvps: [{ type: String }],
  title: { type: String },
  date: { type: String },
  time: { type: String },
  dateObject: { type: Date },
  location: { type: String },
  description: { type: String },
  longitude: Number,
  latitude: Number,
  eventPhotoURL: String,
});
EventSchema.set('toJSON', {
  virtuals: true,
});

// create EventModel class from schema
const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;
