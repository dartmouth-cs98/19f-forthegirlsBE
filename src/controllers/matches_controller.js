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
