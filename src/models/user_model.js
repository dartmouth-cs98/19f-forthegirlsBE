import mongoose, { Schema } from 'mongoose';
// create a UserSchema with a title field
const UserSchema = new Schema({
  username: { type: String, unique: false },
  matches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
