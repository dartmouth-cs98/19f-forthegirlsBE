/* eslint-disable no-loop-func */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Match from '../models/matches_model';
import User from '../models/user_model';
import Award from '../models/award_model';
import Blacklist from '../models/blacklist_model';

dotenv.config({ silent: true });

export const addMatch = (req, res) => {
  const { user1 } = req.body;
  const { user2 } = req.body;
  User.findOne({ username: user1 }).then((resp) => {
    User.findOne({ username: user2 }).then((resp2) => {
      Match.find({ user1: resp.id, user2: resp2.id }).then((response) => {
        if (response.length !== 0) {
          response[0].matched = true;
          response[0].save();
          res.json('match added');
        }
        Match.find({ user1: resp2.id, user2: resp.id }).then((response2) => {
          if (response2.length !== 0) {
            response2[0].matched = true;
            response2[0].save();
            res.json('match added');
          }
        });
        Award.findOne({ userID: resp.id }).then((awardResult) => {
          if (awardResult.firstMatch === false) {
            awardResult.firstMatch = true;
            awardResult.save();
          }
        });
        Award.findOne({ userID: resp2.id }).then((awardResult) => {
          if (awardResult.firstMatch === false) {
            awardResult.firstMatch = true;
            awardResult.save();
          }
        });
      });
    });
  });
};

export const rejectPotentialMatch = (req, res) => {
  const { user1 } = req.body;
  const { user2 } = req.body;
  User.findOne({ username: user1 }).then((resp) => {
    User.findOne({ username: user2 }).then((resp2) => {
      Match.find({ user1: resp.id, user2: resp2.id }).then((response) => {
        if (response.length !== 0) {
          response[0].rejected = true;
          response[0].save();
          res.json('match rejected');
        }
        Match.find({ user1: resp2.id, user2: resp.id }).then((response2) => {
          if (response2.length !== 0) {
            response2[0].rejected = true;
            response2[0].save();
            res.json('match rejected');
          }
        });
      });
    });
  });
};


export const removeMatch = (req, res) => {
  Match.findOne({ _id: req.params.id }).then((result) => {
    result.matched = false;
    result.save();
    res.json('match deleted');
  });
};

export const getPotentialMatches = (req, res) => {
  const blacklisted = [];
  const scoreToId = new Map();

  const promises = [];
  const u = req.params.id;

  User.findOne({ username: u }).then((currUser) => {
    Blacklist.find({ $or: [{ reporterID: currUser.id }, { reportedID: currUser.id }] }).then((blocked) => {
      for (let j = 0; j < blocked.length; j += 1) {
        if (blocked[j].block === true) {
          if (blocked[j].reportedID.toString() === currUser.id.toString()) {
            blacklisted.push(blocked[j].reporterID.toString());
          } else if (blocked[j].reporterID.toString() === currUser.id.toString()) {
            blacklisted.push(blocked[j].reportedID.toString());
          }
        }
      }
      User.find().then((response) => {
        for (let i = 0; i < response.length; i += 1) {
          if (currUser.id !== response[i].id) {
            if (blacklisted.includes(response[i].id.toString()) === false) {
              promises.push(
                new Promise(((resolve, reject) => {
                  Match.find({ user1: currUser.id, user2: response[i].id }).then((matchRes1) => {
                    if (matchRes1.length === 0) {
                      Match.find({ user1: response[i].id, user2: currUser.id }).then((matchRes2) => {
                        if (matchRes2.length === 0) {
                          scoreToId.set(matchRes1[0].score, response[i].id);
                        } else if (matchRes2[0].matched === false && matchRes2[0].rejected === false) {
                          scoreToId.set(matchRes2[0].score, response[i].id);
                          resolve(scoreToId);
                        } else {
                          resolve(scoreToId);
                        }
                      });
                    } else if (matchRes1[0].matched === false && matchRes1[0].rejected === false) {
                      scoreToId.set(matchRes1[0].score, response[i].id);
                      resolve(scoreToId);
                    } else {
                      resolve(scoreToId);
                    }
                  });
                })),
              );
            }
          }
        }
        Promise.all(promises).then(() => {
          const realResults = [];
          const keys = [];

          scoreToId.forEach((value, key) => {
            keys.push(key);
          });
          keys.sort();
          for (let i = keys.length - 1; i >= 0; i -= 1) {
            realResults.push(scoreToId.get(keys[i]));
          }
          if (realResults.length > 5) {
            res.send(realResults.splice(0, 5));
          } else {
            res.send(realResults);
          }

          res.send(realResults);
        });
      });
    });
  });
};

export const getMatches = (req, res) => {
  const promises = [];
  const usernameToId = new Map();
  const u = req.params.id;
  User.findOne({ username: u }).then((currUser) => {
    User.find().then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        if (currUser.id !== response[i].id) {
          promises.push(
            new Promise(((resolve, reject) => {
              Match.find({ user1: currUser.id, user2: response[i].id }).then((matchRes1) => {
                if (matchRes1.length === 0) {
                  Match.find({ user1: response[i].id, user2: currUser.id }).then((matchRes2) => {
                    if (matchRes2.length === 0) {
                      resolve(usernameToId);
                    } else if (matchRes2[0].matched === true) {
                      usernameToId.set(response[i].username, response[i].id);
                      resolve(usernameToId);
                    } else {
                      resolve(usernameToId);
                    }
                  });
                } else if (matchRes1[0].matched === true) {
                  usernameToId.set(response[i].username, response[i].id);
                  resolve(usernameToId);
                } else {
                  resolve(usernameToId);
                }
              });
            })),
          );
        }
      }
      Promise.all(promises).then(() => {
        const realResults = [];
        const keys = [];

        usernameToId.forEach((value, key) => {
          keys.push(key);
        });
        keys.sort();
        for (let i = 0; i < keys.length; i += 1) {
          realResults.push(usernameToId.get(keys[i]));
        }

        res.send(realResults);
      });
    });
  });
};

export const getMatchId = (req, res) => {
  Match.find({ user1: req.params.id1, user2: req.params.id2 }).then((response) => {
    if (response.length !== 0) {
      res.json(response[0].id);
    } else {
      Match.find({ user1: req.params.id2, user2: req.params.id1 }).then((response2) => {
        if (response2.length !== 0) {
          res.json(response2[0].id);
        }
      });
    }
  });
};
