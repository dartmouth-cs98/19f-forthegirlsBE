/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import dotenv from 'dotenv';
import Chat from '../models/chat_model';

dotenv.config({ silent: true });

export const addChat = (req, res) => {
  const { sender } = req.body;
  const { receiver } = req.body;
  const timestamp = Date.now();
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

// Stackoverflow for pagination
// .limit( 10 )
// .sort( '-createdOn' )
export const getBetween = (req, res) => {
  const { firstID } = req.body;
  const { secondID } = req.body;

  Chat.find({ $or: [{ sender: firstID, receiver: secondID }, { sender: secondID, receiver: firstID }] })
    .limit(10)
    .sort('-timestamp')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getToFrom = (req, res) => {
  const { sendID } = req.body;
  const { receiveID } = req.body;

  Chat.find({ sender: sendID, receiver: receiveID })
    .limit(10)
    .sort('-timestamp')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


export const loadMore = (req, res) => {
  const { firstID } = req.body;
  const { secondID } = req.body;
  const { loadNumber } = req.body;

  Chat.find({ $or: [{ sender: firstID, receiver: secondID }, { sender: secondID, receiver: firstID }] })
    .limit(loadNumber)
    .sort('-timestamp')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
