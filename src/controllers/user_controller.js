/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
import Match from '../models/matches_model';
import Award from '../models/award_model';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  const { username } = req.body;
  User.findOne({ username }).then((result) => {
    Award.findOne({ userID: result.id })
      .then((result2) => {})
      .catch(() => {
        const award = new Award();
        award.userID = result.id;
        award.save();
      });
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
                const award = new Award();
                award.userID = currUser.id;
                award.save();
                User.find().then((response) => {
                  for (let i = 0; i < response.length; i += 1) {
                    if (currUser.id !== response[i].id) {
                      const match = new Match();
                      match.user1 = currUser.id;
                      match.user2 = response[i].id;
                      // TO DO: Calculate score for this user
                      // response.keys().filter(k => {k.match(/^score.*/)}).forEach(key =>{
                      //   if (currUser[key] == respond[i][key]) //add to score
                      // })
                      // alternative
                      // response.score_keys.forEach/


                      // console.log(Object.keys(response[i].schema.tree));
                      match.score = 0;


                      Object.keys(response[i].schema.tree).filter((k) => { return k.match(/^score.*/); }).forEach((key) => {
                        console.log(key);
                        if (currUser[key] === response[i][key]) {
                          match.score++;
                          // match.save();
                        } // add to score
                      });


                      // alternative
                      // response.score_keys.forEach/
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
    // recalculate score
    User.find().then((others) => {
      for (let i = 0; i < others.length; i += 1) {
        if (result.id !== others[i].id) {
          Match.find({ user1: result.id, user2: others[i].id }).then((matchRes1) => {
            if (matchRes1.length === 0) {
              Match.find({ user1: others[i].id, user2: result.id }).then((matchRes2) => {
                if (matchRes2.length === 0) {
                  // resolve(resultArray);
                } else {
                  // RECALCULATE SCORE FOR MATCH RES 2
                  // console.log('HEREE');
                  Object.keys(others[i].schema.tree).filter((k) => { return k.match(/^score.*/); }).forEach((key) => {
                    // console.log(key);
                    if (result[key] === others[i][key] && result[key]) {
                      matchRes2[0].score++;
                      // match.save();
                    } // add to score
                  });
                  matchRes2[0].save();
                }
              });
            } else {
              // console.log('HEREEEE');
              Object.keys(others[i].schema.tree).filter((k) => { return k.match(/^score.*/); }).forEach((key) => {
                // console.log(key);
                if (result[key] === others[i][key] && result[key]) {
                  // console.log(key);
                  // console.log(result[key]);
                  matchRes1[0].score++;
                  // match.save();
                } // add to score
              });
              matchRes1[0].save();
              // RECALCULATE SCORE FOR MATCH RES 1
            }
          });
        }
      }
    });
    result.save();
    console.log(fields);
    res.json({ result });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
