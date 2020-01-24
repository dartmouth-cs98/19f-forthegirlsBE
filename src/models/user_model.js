import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// create a UserSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true },
  password: { type: String },
  // matches: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // survey: { type: Schema.Types.ObjectId, ref: 'Survey' },

  // SURVEY QUESTIONS:

  // Basic
  firstName: String,
  lastName: String,
  photoURL: String,
  highSchool: String,
  collegeName: String,
  gradYear: String,
  currentJob: String,
  hometown: String,
  location: String,

  // CS:
  frontEnd: Boolean,
  backEend: Boolean,
  small: Boolean,
  medium: Boolean,
  large: Boolean,
  meritocratic: Boolean,
  nurturing: Boolean,
  fratty: Boolean,
  fast: Boolean,
  organized: Boolean,
  stable: Boolean,
  formal: Boolean,
  relaxed: Boolean,
  web: Boolean,
  user: Boolean,
  design: Boolean,
  mobile: Boolean,
  security: Boolean,
  algorithms: Boolean,
  storage: Boolean,

  // Demographic
  age: Number,
  hs: Boolean,
  college: Boolean,
  pg: Boolean,

  // Personality
  extraversion: Number,
  listening: Number,

  // Prompts
  promptOneQuestion: String,
  promptOneAnswer: String,
  promptTwoQuestion: String,
  promptTwoAnswer: String,
  promptThreeQuestion: String,
  promptThreeAnswer: String,
  introextro: Number,
  listenFollow: Number,

  profileURL: String,
});
UserSchema.set('toJSON', {
  virtuals: true,
});
UserSchema.pre('save', function beforeUserModelSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  return next();

  // TODO: do stuff here

  // when done run the **next** callback with no arguments
  // call next with an error if you encounter one
  // return next();
});
//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  console.log('in compare pass');
  // const user = this;
  // console.log(user.password);
  bcrypt.compare(candidatePassword, this.password, (err, res) => {
    if (res) {
      return callback(null, res);
    } else {
      return callback(err);
    }
  });

//   return callback(null, bcrypt.compareSync(candidatePassword, user.password));
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
};
// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
