/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Event from '../models/event_model';

dotenv.config({ silent: true });

export const addEvent = (req, res) => {
  const { title } = req.body;
  const { date } = req.body;
  const { time } = req.body;
  const { location } = req.body;
  const { description } = req.body;
  const event = new Event();
  event.title = title;
  event.date = date;
  event.time = time;
  event.location = location;
  event.description = description;
  event.save()
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => {
      console.log(error);
    });
};

// for (let i = result.rsvps.length - 1; i >= 0; i -= 1) {
//   if (result.rsvps[i] === userID) {
//     // result.rsvps.splice(i, 1);
//     break;
//   }
// }

export const rsvpEvent = (req, res) => {
  const { userID } = req.body;

  Event.findById({ _id: req.params.id }).then((result) => {
    result.rsvps.push(userID);
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
  // got this from mongoosejs docs online
  Event.find({})
    .then((result) => {
      // res.json({ message: 'found all the posts!' });
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
