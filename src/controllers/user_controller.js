/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

// eslint-disable-next-line consistent-return
export const signup = (req, res, next) => {
  const { email } = req.body;
  const { username } = req.body;
  const { password } = req.body;

  if (!email || !password || !username) {
    return res.status(422).send('You must provide email, username and password');
  }

  User.findOne({ email }).then((result) => {
    if (result != null) {
      return res.status(425).send('User exists with the email provided.');
    } else {
      User.findOne({ username }).then((result2) => {
        if (result2 != null) {
          return res.status(425).send('User exists with the username provided.');
        } else {
          const user = new User();
          user.email = email;
          user.username = username;
          user.password = password;
          user.matches = [];
          user.save()
            .then((resp) => {
              // res.send({ token: tokenForUser(user) });
              res.json(resp);
            })
            .catch((error) => {
              console.log(error);
              // return res.status(555).send('Problem adding user');
            });
        }
      });
    }
  });
};
export const editUser = (req, res) => {
  const { username } = req.params.id;
  const newName = req.body.username;
  const newPW = req.body.password;
  User.findOneAndUpdate({ username }).then((result) => {
    result.username = newName;
    result.password = newPW;
    res.json({ result });
    result.save();
  });
};

export const getUser = (req, res) => {
  const username = req.params.id;

  User.findOne({ username }).populate('matches').then((result) => {
    console.log(result);
    res.json({ result });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

// encodes a new token for a user object
// function tokenForUser(user) {
//   const timestamp = new Date().getTime();
//   return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
// }
