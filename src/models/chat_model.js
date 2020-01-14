import mongoose, { Schema } from 'mongoose';

// create a EventSchema with a title field
const ChatSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date },
  text: { type: String },
});
ChatSchema.set('toJSON', {
  virtuals: true,
});

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
