/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import Blacklist from '../models/blacklist_model';
import Match from '../models/matches_model';
import Chat from '../models/chat_model';

dotenv.config({ silent: true });

export const report = (req, res) => {
  Blacklist.findOne({ reporterID: req.params.reporterID, reportedID: req.params.reportedID }).then((result) => {
    result.report = true;
    result.save();
    res.json(result);
  }).catch((error) => {
    const blacklist = new Blacklist();
    blacklist.reporterID = req.params.reporterID;
    blacklist.reportedID = req.params.reportedID;
    blacklist.report = true;
    blacklist.save()
      .then((resp) => {
        res.json(resp);
      })
      .catch((error2) => {
        res.status(500).json({ error2 });
      });
  });
};

// deletes matches and chats
// manually blocks in getting potential matches
export const block = (req, res) => {
  Blacklist.findOne({ reporterID: req.params.reporterID, reportedID: req.params.reportedID }).then((result) => {
    result.block = true;
    result.save()
      .then((resp1) => {
        Match.deleteOne({ $or: [{ user1: req.params.reporterID, user2: req.params.reportedID }, { user1: req.params.reportedID, user2: req.params.reporterID }] }).then((chatResult1) => {
          Chat.deleteMany({ $or: [{ sender: req.params.reporterID, receiver: req.params.reportedID }, { sender: req.params.reportedID, receiver: req.params.reporterID }] }).then((matchResult1) => {
            res.json(matchResult1);
          });
        });
      });
    res.json(result);
  }).catch((error) => {
    const blacklist = new Blacklist();
    blacklist.reporterID = req.params.reporterID;
    blacklist.reportedID = req.params.reportedID;
    blacklist.block = true;
    blacklist.save()
      .then((resp) => {
        Match.deleteOne({ $or: [{ user1: req.params.reporterID, user2: req.params.reportedID }, { user1: req.params.reportedID, user2: req.params.reporterID }] }).then((result) => {
          Chat.deleteMany({ $or: [{ sender: req.params.reporterID, receiver: req.params.reportedID }, { sender: req.params.reportedID, receiver: req.params.reporterID }] }).then((result2) => {
            res.json(result2);
          });
        });
      })
      .catch((error2) => {
        res.status(500).json({ error2 });
      });
  });
};
