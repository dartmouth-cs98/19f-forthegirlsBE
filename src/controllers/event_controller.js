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
