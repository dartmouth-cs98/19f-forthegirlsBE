/* eslint-disable no-restricted-syntax */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
// import Expo from 'expo-server-sdk';
import User from './models/user_model';
import apiRouter from './router';

// const expo = new Expo();

// const savedPushTokens = [];

// do saving of token in signin/signup user instead in the user model as a string
// const saveToken = (token) => {
//   if (savedPushTokens.indexOf(token === -1)) {
//     savedPushTokens.push(token);
//   }
// };
// just send one message to one user
// extract into services/notifications.js and import in chat_controller to send

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/ftg';
mongoose.connect(mongoURI);
// set mongoose promises to es6 default
mongoose.Promise = global.Promise;

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hi this is an API response.');
  const user = new User();
  user.username = 'test';
  user.save();
});
app.use('/api', apiRouter);
// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
