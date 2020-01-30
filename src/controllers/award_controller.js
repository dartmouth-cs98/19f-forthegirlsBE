/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import Award from '../models/award_model';

dotenv.config({ silent: true });


export const checkAward = (req, res) => {
  Award.findOne({ userID: req.params.id }).then((result) => {
    const awardName = req.params.awardTitle;
    let awarded = false;
    awarded = result[awardName];

    res.json(awarded);
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

export const checkAllAwards = (req, res) => {
  Award.findOne({ userID: req.params.id }).then((result) => {
    const fields = Object.keys(Award.schema.paths);
    console.log(fields);
    const awards = [];
    for (let i = 0; i < fields.length; i += 1) {
      const currField = fields[i];
      if (currField.toString() !== 'userID' && currField.toString() !== '_id' && currField.toString() !== '__v') {
        awards.push(currField);
        awards.push(result[currField]);
      }
    }
    console.log(awards);
    res.json(awards);
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
