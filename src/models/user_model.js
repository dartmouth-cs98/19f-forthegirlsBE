import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// create a UserSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  username: { type: String, unique: true },
  password: { type: String },
  firstTime: Boolean,

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
  longitude: Number,
  latitude: Number,

  // CS:
  score_frontEnd: Boolean,
  score_backEnd: Boolean,
  score_small: Boolean,
  score_medium: Boolean,
  score_large: Boolean,
  score_meritocratic: Boolean,
  score_nurturing: Boolean,
  score_fratty: Boolean,
  score_fast: Boolean,
  score_organized: Boolean,
  score_stable: Boolean,
  score_formal: Boolean,
  score_relaxed: Boolean,
  score_web: Boolean,
  score_user: Boolean,
  score_design: Boolean,
  score_mobile: Boolean,
  score_security: Boolean,
  score_algorithms: Boolean,
  score_storage: Boolean,

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
  pushTokens: [String],
});

// // returns keuys to compute score on
// UserScheme.virtuals += (score_keys) => {
//   returns['web', 'mobile'];
//   // or some other logic for returning the important keys
// };

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

  // when done run the **next** callback with no arguments
  // call next with an error if you encounter one
  // return next();
});
//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, res) => {
    if (res) {
      return callback(null, res);
    } else {
      return callback(err);
    }
  });

  // return callback(null, bcrypt.compareSync(candidatePassword, user.password));
  // return callback(null, comparisonResult) for success
  // or callback(error) in the error case
};
// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
