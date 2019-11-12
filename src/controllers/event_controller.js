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

export const rsvpEvent = (req, res) => {
  const { userID } = req.body;

  Event.findById({ _id: req.params.id }).populate('rsvps').then((result) => {
    console.log(` hi there${userID}`);
    result.rsvps.push(userID);
    res.json(result.rsvps);
    result.save();
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
