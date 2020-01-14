/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable new-cap */
import dotenv from 'dotenv';
import Chat from '../models/chat_model';

dotenv.config({ silent: true });

export const addChat = (req, res) => {
  const { sender } = req.body;
  const { receiver } = req.body;
  const { text } = req.body;
  const timestamp = Date.now();

  const chat = new Chat();
  chat.sender = sender;
  chat.receiver = receiver;
  chat.timestamp = timestamp;
  chat.text = text;
  chat.save()
    .then((resp3) => {
      res.json(resp3);
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
  Chat.find({ $or: [{ sender: req.params.id2, receiver: req.params.id1 }, { sender: req.params.id1, receiver: req.params.id2 }] })
    .limit(10)
    .sort('timestamp')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getToFrom = (req, res) => {
  Chat.find({ sender: req.params.id1, receiver: req.params.id2 })
    .limit(10)
    .sort('timestamp')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


export const loadMore = (req, res) => {
  Chat.find({ $or: [{ sender: req.params.id1, receiver: req.params.id2 }, { sender: req.params.id2, receiver: req.params.id1 }] })
    .limit(req.params.loadNumber)
    .sort('timestamp')
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
