/* eslint-disable no-loop-func */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Match from '../models/matches_model';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const addMatch = (req, res) => {
  let exists = false;
  const { user1 } = req.body;
  const { user2 } = req.body;
  const { matched } = req.body;
  const match = new Match();
  User.findOne({ username: user1 }).then((resp) => {
    User.findOne({ username: user2 }).then((resp2) => {
      Match.find({ user1: resp.id, user2: resp2.id }).then((response) => {
        if (response.length !== 0) {
          exists = true;
        }
        Match.find({ user1: resp2.id, user2: resp.id }).then((response2) => {
          if (response2.length !== 0) {
            exists = true;
          }
          if (exists === false) {
            match.user1 = resp.id;
            match.user2 = resp2.id;
            match.matched = matched;
            match.save()
              .then((saveResp) => {
                res.json(saveResp);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            res.json('Match exists');
          }
        });
      });
    });
  });
};

export const removeMatch = (req, res) => {
  // const { user1 } = req.body;
  // const { user2 } = req.body;
  // const match = new Match();
  Match.deleteOne({ _id: req.params.id }).then((result) => {
    res.json({ result });
  });
};

export const getPotentialMatches = (req, res) => {
  const resultArray = [];
  const promises = [];
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
                      resultArray.push(response[i].id);
                    }
                    resolve(resultArray);
                  });
                } else {
                  resolve(resultArray);
                }
              });
            })),
          );
        }
      }
      Promise.all(promises).then(() => {
        res.send(resultArray);
      });
    });
  });
};

export const getMatches = (req, res) => {
  const resultArray = [];
  const promises = [];
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
                      resolve(resultArray);
                    } else if (matchRes2[0].matched === true) {
                      resultArray.push(response[i].id);
                      resolve(resultArray);
                    } else {
                      resolve(resultArray);
                    }
                  });
                } else if (matchRes1[0].matched === true) {
                  resultArray.push(response[i].id);
                  resolve(resultArray);
                } else {
                  resolve(resultArray);
                }
              });
            })),
          );
        }
      }
      Promise.all(promises).then(() => {
        res.send(resultArray);
      });
    });
  });
};

export const getMatchId = (req, res) => {
  // let exists = false;
  // const { user1 } = req.params.id1;
  // const { user2 } = req.params.id2;
  // const match = new Match();
  // User.findById({ _id: req.params.id1 }).then((resp) => {
  // User.findById({ _id: req.params.id2 }).then((resp2) => {
  Match.find({ user1: req.params.id1, user2: req.params.id2 }).then((response) => {
    if (response.length !== 0) {
      // exists = true;
      res.json(response[0].id);
    } else {
      Match.find({ user1: req.params.id2, user2: req.params.id1 }).then((response2) => {
        if (response2.length !== 0) {
          // exists = true;
          res.json(response2[0].id);
        }
        // res.json('Match does not exist');
      });
    }
  });
  // });
  // });
};
