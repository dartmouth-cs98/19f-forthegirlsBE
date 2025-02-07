/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable radix */
import dotenv from 'dotenv';
import Event from '../models/event_model';
import Match from '../models/matches_model';
import User from '../models/user_model';
import Award from '../models/award_model';

dotenv.config({ silent: true });

const awardRSVPS = 2;

export const addEvent = (req, res) => {
  const { title } = req.body;
  const { date } = req.body;
  const { time } = req.body;
  const { location } = req.body;
  const { description } = req.body;
  const { longitude } = req.body;
  const { latitude } = req.body;
  const { authorID } = req.body;
  const { eventPhotoURL } = req.body;

  const day = parseInt(date.substring(8, 10));
  const year = parseInt(date.substring(11, 15));
  const minute = parseInt(time.substring(3, 5));
  const hour = parseInt(time.substring(0, 2));

  const monthString = date.substring(4, 7);
  let monthNum = 0;
  if (monthString === 'Feb') {
    monthNum = 1;
  } else if (monthString === 'Mar') {
    monthNum = 2;
  } else if (monthString === 'Apr') {
    monthNum = 3;
  } else if (monthString === 'May') {
    monthNum = 4;
  } else if (monthString === 'Jun') {
    monthNum = 5;
  } else if (monthString === 'Jul') {
    monthNum = 6;
  } else if (monthString === 'Aug') {
    monthNum = 7;
  } else if (monthString === 'Sep') {
    monthNum = 8;
  } else if (monthString === 'Oct') {
    monthNum = 9;
  } else if (monthString === 'Nov') {
    monthNum = 10;
  } else if (monthString === 'Dec') {
    monthNum = 11;
  }

  const ourDate = new Date();
  ourDate.setDate(day);
  ourDate.setMonth(monthNum);
  ourDate.setYear(year);
  ourDate.setHours(hour, minute, 0);

  const event = new Event();
  event.title = title;
  event.date = date;
  event.time = time;
  event.dateObject = ourDate;
  event.location = location;
  event.description = description;
  event.latitude = latitude;
  event.longitude = longitude;
  event.authorID = authorID;
  event.eventPhotoURL = eventPhotoURL;
  event.save()
    .then((resp) => {
      Event.find({ authorID }).then((result) => {
        if (result.length === 1) {
          Award.findOne({ userID: authorID }).then((awardRes) => {
            if (awardRes.firstEventAdded === false) {
              awardRes.firstEventAdded = true;
              awardRes.save();
            }
          });
        }
        res.json(resp);
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const rsvpEvent = (req, res) => {
  const { userID } = req.body;
  Event.findById({ _id: req.params.id }).then((result) => {
    if (!result.rsvps.includes(userID)) {
      result.rsvps.push(userID);
      Event.find({ rsvps: { $in: [userID] } })
        .then((result2) => {
          if (result2.length >= awardRSVPS) {
            Award.findOne({ userID }).then((result3) => {
              if (result3.rsvpThree === false) {
                result3.rsvpThree = true;
                result3.save();
              }
            });
          }
        });
    }

    res.json(result.rsvps);
    result.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

export const unrsvpEvent = (req, res) => {
  const { userID } = req.body;

  Event.findById({ _id: req.params.id }).then((result) => {
    for (let i = result.rsvps.length - 1; i >= 0; i -= 1) {
      if (result.rsvps[i] === userID) {
        result.rsvps.splice(i, 1);
      }
    }
    res.json(result.rsvps.length);
    result.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

export const getEvents = (req, res) => {
  const rightNow = new Date();

  // got this from mongoosejs docs online
  Event.find(
    {
      dateObject: {
        $gte: rightNow,
      },
    },
  )
    .sort('dateObject')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getEvent = (req, res) => {
  Event.findOne({ _id: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getRsvpCount = (req, res) => {
  Event.findOne({ _id: req.params.id })
    .then((result) => {
      res.json(result.rsvps.length);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getYourRsvps = (req, res) => {
  Event.find({
    rsvps: { $in: [req.params.id] },
    dateObject: {
      $gte: Date.now(),
    },
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getAPI = (req, res) => {
  res.json(process.env.GOOGLE_API_KEY).catch((error) => {
    res.status(500).json({ error });
  });
};

export const getConnectionRsvps = (req, res) => {
  const connectionsAttending = [];
  const promises = [];

  Event.findOne({ _id: req.params.eventId })
    .then((eventResponse) => {
      const eventRsvps = eventResponse.rsvps;
      Match.find({ $or: [{ user1: req.params.userId }, { user2: req.params.userId }] })
        .then((matchResponses) => {
          if (matchResponses.length !== 0) {
            for (let i = matchResponses.length - 1; i >= 0; i -= 1) {
              if (matchResponses[i].matched === true) {
                if (matchResponses[i].user1.toString() === req.params.userId.toString()) {
                  const connection = matchResponses[i].user2;
                  for (let j = eventRsvps.length - 1; j >= 0; j -= 1) {
                    if (eventRsvps[j].toString() === connection.toString()) {
                      promises.push(
                        new Promise(((resolve, reject) => {
                          User.findById({ _id: connection }).then((result) => {
                            connectionsAttending.push(result);
                            resolve(connectionsAttending);
                          });
                        })),
                      );
                    }
                  }
                } else {
                  const connection = matchResponses[i].user1;
                  for (let j = eventRsvps.length - 1; j >= 0; j -= 1) {
                    if (eventRsvps[j].toString() === connection.toString()) {
                      promises.push(
                        new Promise(((resolve, reject) => {
                          User.findById({ _id: connection }).then((result) => {
                            connectionsAttending.push(result);
                            resolve(connectionsAttending);
                          });
                        })),
                      );
                    }
                  }
                }
              }
            }
          }
          Promise.all(promises).then(() => {
            res.json(connectionsAttending);
          });
        });
    });
};
