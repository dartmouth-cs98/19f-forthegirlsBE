/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import Blacklist from '../models/blacklist_model';

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
        console.log(error2);
      });
  });
};

export const block = (req, res) => {
  Blacklist.findOne({ reporterID: req.params.reporterID, reportedID: req.params.reportedID }).then((result) => {
    result.block = true;
    result.save();
    res.json(result);
  }).catch((error) => {
    const blacklist = new Blacklist();
    blacklist.reporterID = req.params.reporterID;
    blacklist.reportedID = req.params.reportedID;
    blacklist.block = true;
    blacklist.save()
      .then((resp) => {
        res.json(resp);
      })
      .catch((error2) => {
        console.log(error2);
      });
  });
};
