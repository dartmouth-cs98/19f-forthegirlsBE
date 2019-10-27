import mongoose, { Schema } from 'mongoose';
// create a UserSchema with a title field
const UserSchema = new Schema({
  username: { type: String, unique: true },
});
// create UserModel class from schema
const UserModel = mongoose.model('Users', UserSchema);

export default UserModel;
