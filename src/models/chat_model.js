import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const ChatSchema = new Schema({
  sender: { type: String },
  reciever: { type: String },
  timestamp: { type: String },
  text: { type: String },
});
ChatSchema.set('toJSON', {
  virtuals: true,
});

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
