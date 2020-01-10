/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Chat from '../models/chat_model';

dotenv.config({ silent: true });

export const addChat = (req, res) => {
  const { sender } = req.body;
  const { reciever } = req.body;
  const { timestamp } = req.body;
  const { text } = req.body;
  const chat = new Chat();
  chat.sender = sender;
  chat.reciever = reciever;
  chat.timestamp = timestamp;
  chat.text = text;
  chat.save()
    .then((resp) => {
      res.json(resp);
    })
    .catch((error) => {
      console.log(error);
    });
};
