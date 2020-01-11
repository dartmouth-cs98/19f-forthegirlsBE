import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const ChatSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId },
  receiver: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },
  text: { type: String },
});
ChatSchema.set('toJSON', {
  virtuals: true,
});

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
