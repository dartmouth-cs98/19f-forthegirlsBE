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

const lookForMatch = (user1Id, user2Id, array) => {
  Match.find({ user1: user1Id, user2: user2Id }).then((matchRes1) => {
    if (matchRes1.length === 0) {
      console.log('match res 1 not found');
      // var matchRes2 = Match.find({ user1: response[i].id, user2: currUser.id })
      Match.find({ user1: user2Id, user2: user1Id }).then((matchRes2) => {
        if (matchRes2.length === 0) {
          console.log('match res 2 not found');
          array.push(user1Id);
          //  console.log(resu)
          console.log('result array:');
          console.log(array);
          return (array);
        }
      });
    }
  });
};

let resultArray = [];
export const getPotentialMatches = (req, res) => {
  resultArray = [];
  // let newArray;
  const { username } = req.params.id;
  User.findOne(username).then((currUser) => {
    User.find().then((response) => {
      for (let i = 0; i < response.length; i += 1) {
        if (currUser.id !== response[i].id) {
          // newArray = lookForMatch(currUser.id, response[i].id, resultArray);
          // resultArray = newArray;


          Match.find({ user1: currUser.id, user2: response[i].id }).then((matchRes1) => {
            if (matchRes1.length === 0) {
              console.log('match res 1 not found');
              // var matchRes2 = Match.find({ user1: response[i].id, user2: currUser.id })
              Match.find({ user1: response[i].id, user2: currUser.id }).then((matchRes2) => {
                if (matchRes2.length === 0) {
                  console.log('match res 2 not found');
                  resultArray.push(response[i].id);
                  //  console.log(resu)
                  console.log('result array:');
                  console.log(resultArray);
                }
              });
            }
          });
        }
      }
      res.send(resultArray);
    });
  });
};
