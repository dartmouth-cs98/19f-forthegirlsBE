/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Chat from '../models/chat_model';

dotenv.config({ silent: true });

export const addChat = (req, res) => {
  const { sender } = req.body;
  const { receiver } = req.body;
  const { timestamp } = req.body;
  const { text } = req.body;
  const chat = new Chat();
  chat.sender = sender;
  chat.receiver = receiver;
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

// From mongoose documentation
// MyModel.find({ name: 'john', age: { $gte: 18 }});
export const getBetween = (req, res) => {
  const { sendID } = req.body;
  const { receiveID } = req.body;

  Chat.find({ sender: sendID, receiver: receiveID })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
