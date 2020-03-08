/* eslint-disable import/prefer-default-export */
import dotenv from 'dotenv';
import Activity from '../models/activity_model';

dotenv.config({ silent: true });

export const addActivity = (req, res) => {
  const { userID } = req.params.id;
  const { timestamp } = req.body;
  Activity.findOneAndUpdate({ userID }).then((result) => {
    result.allLogins.push(timestamp);
    result.lastLogin = timestamp;

    const day = result.lastLogin.getDate();
    const month = result.lastLogin.getMonth();

    let monthBefore = month;

    let dayBefore = day - 1;
    if (dayBefore === 0) {
      if (monthBefore === 0 || monthBefore === 2 || monthBefore === 4 || monthBefore === 6 || monthBefore === 7 || monthBefore === 9 || monthBefore === 11) {
        dayBefore = 31;
      } else if (monthBefore === 1) {
        dayBefore = 28;
      } else {
        dayBefore = 30;
      }
      if (monthBefore === -1) {
        monthBefore = 11;
      }
    }

    for (let i = result.allLogins.length - 2; i >= 0; i -= 1) {
      const currDate = result.allLogins[i];
      const currDay = currDate.getDate();
      const currMonth = currDate.getMonth();

      if (currDay === dayBefore && currMonth === monthBefore) {
        result.dayStreak += 1;
        break;
      } else if (currDay !== day || currMonth !== month) {
        result.dayStreak = 1;
        break;
      }
    }

    result.save();
    res.json(result);
  }).catch((error) => {
    res.json(error);
  });
};
