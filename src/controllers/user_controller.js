/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
import Match from '../models/matches_model';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username }).then((result) => {
    res.send({ token: tokenForUser(req.user), username: req.user.username, id: result.id });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

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
          user.save()
            .then((resp) => {
              // add matches for all other users with matched boolean false
              User.findOne({ username }).then((currUser) => {
                User.find().then((response) => {
                  for (let i = 0; i < response.length; i += 1) {
                    if (currUser.id !== response[i].id) {
                      const match = new Match();
                      match.user1 = currUser.id;
                      match.user2 = response[i].id;
                      // TO DO: Calculate score for this user
                      match.score = 0;
                      match.matched = false;
                      match.save();
                    }
                  }
                });
              });
              res.send({ token: tokenForUser(user), username: req.body.username, id: user.id });
            })
            .catch((error) => {
              console.log(error);
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
  const { profileURL } = req.body;
  User.findOneAndUpdate({ username }).then((result) => {
    result.username = newName;
    result.password = newPW;
    result.profileURL = profileURL;
    res.json({ result });
    result.save();
  });
};

export const getUser = (req, res) => {
  User.findById({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.json({ result });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const addToSurvey = (req, res) => {
  console.log('Did this');
  const username = req.params.id;
  User.findOne({ username }).then((result) => {
    const fields = Object.keys(req.body);
    for (let i = 0; i < fields.length; i++) {
      console.log(fields[i]);
      result[fields[i]] = req.body[fields[i]];
    }
    result.save();
    console.log(fields);
    res.json({ result });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
