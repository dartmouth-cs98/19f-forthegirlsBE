/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';
import Match from '../models/matches_model';
import Award from '../models/award_model';
import Activity from '../models/activity_model';

// const π = Math.PI;


dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  // include saving push token
  const { username } = req.body;
  const { pushToken } = req.body;
  User.findOne({ username }).then((result) => {
    result.pushTokens.push(pushToken);
    result.save();
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
  // include saving push token
  const { email } = req.body;
  const { username } = req.body;
  const { password } = req.body;
  const { pushToken } = req.body;
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
          user.firstTime = true;
          user.pushTokens.push(pushToken);
          user.save()
            .then((resp) => {
              // add matches for all other users with matched boolean false
              User.findOne({ username }).then((currUser) => {
                const award = new Award();
                award.userID = currUser.id;
                award.save();
                const activity = new Activity();
                activity.userID = currUser.id;
                activity.save();
                User.find().then((response) => {
                  for (let i = 0; i < response.length; i += 1) {
                    if (currUser.id !== response[i].id) {
                      const match = new Match();
                      match.user1 = currUser.id;
                      match.user2 = response[i].id;
                      match.score = 0;


                      Object.keys(response[i].schema.tree).filter((k) => { return k.match(/^score.*/); }).forEach((key) => {
                        console.log(key);
                        if (currUser[key] === response[i][key] && currUser[key] !== undefined) {
                          match.score++;
                        }
                      });
                      if (currUser.collegeName === response[i].collegeName && currUser.collegeName !== undefined) {
                        match.score += 2;
                      }
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
  const newFirstTime = req.body.firstTime;
  User.findOneAndUpdate({ username }).then((result) => {
    result.username = newName;
    result.firstTime = newFirstTime;
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
                  console.log('matchres2');
                  // Reset match score to 0, then recalculate
                  matchRes2[0].score = 0;
                  Object.keys(others[i].schema.tree).filter((k) => { return k.match(/^score.*/); }).forEach((key) => {
                    if (result[key] === others[i][key] && result[key] !== undefined) {
                      matchRes2[0].score++;
                      matchRes2[0].save();
                    }
                  });
                  if (result.collegeName === others[i].collegeName && result.collegeName !== undefined) {
                    matchRes2[0].score += 2;
                    matchRes2[0].save();
                  }
                  if (result.latitude !== undefined && result.longitude !== undefined && others[i].latitude !== undefined && others[i].longitude !== undefined) {
                    // calculate distance between latitude/longitudes of users
                    const distance = calculateDistance(result.latitude, result.longitude, others[i].latitude, others[i].longitude);
                    console.log('DISTANCE IS:');
                    console.log(Math.floor(distance / 1000000));
                    matchRes2[0].score += Math.floor(distance / 1000000);
                    matchRes2[0].save();
                  }
                }
              });
            } else {
              console.log('matchres1');

              // Reset match score to 0, then recalculate
              matchRes1[0].score = 0;
              Object.keys(others[i].schema.tree).filter((k) => { return k.match(/^score.*/); }).forEach((key) => {
                if (result[key] === others[i][key] && result[key] !== undefined) {
                  matchRes1[0].score++;
                  matchRes1[0].save();
                }
              });
              if (result.collegeName === others[i].collegeName && result.collegeName !== undefined) {
                matchRes1[0].score += 2;
                matchRes1[0].save();
              }
              if (result.latitude !== undefined && result.longitude !== undefined && others[i].latitude !== undefined && others[i].longitude !== undefined) {
                // calculate distance between latitude/longitudes of users
                const distance = calculateDistance(result.latitude, result.longitude, others[i].latitude, others[i].longitude);
                console.log('DISTANCE IS:');
                console.log(Math.floor(distance / 1000000));
                matchRes1[0].score += Math.floor(distance / 1000000);
                matchRes1[0].save();
              }
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

function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
  console.log('LATITUDE1');
  console.log(latitude1);
  console.log('LONGITUDE1');
  console.log(longitude1);
  console.log('LATITUDE2');
  console.log(latitude2);
  console.log('LONGITUDE2');
  console.log(longitude2);
  const R = 6371e3; // metres
  const φ1 = toRadians(latitude1);
  const φ2 = toRadians(latitude2);
  const Δφ = toRadians(latitude2 - latitude1);
  const Δλ = toRadians(longitude2 - longitude1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
          + Math.cos(φ1) * Math.cos(φ2)
          * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
}

function toRadians(number) {
  return number * (Math.PI / 180);
}
// Number.prototype.toRadians = function () { return this * Math.PI / 180; };
