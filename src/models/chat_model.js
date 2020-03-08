import mongoose, { Schema } from 'mongoose';

const ChatSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date },
  text: { type: String },
  receiverRead: { type: Boolean, default: false },
});
ChatSchema.set('toJSON', {
  virtuals: true,
});

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;
