import mongoose, { Schema } from 'mongoose';
// create a UserSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true },
  password: { type: String },
  matches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
