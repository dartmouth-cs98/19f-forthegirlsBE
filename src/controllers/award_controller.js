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
