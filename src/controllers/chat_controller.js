/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable new-cap */
import dotenv from 'dotenv';
import Chat from '../models/chat_model';
import Award from '../models/award_model';

dotenv.config({ silent: true });

const contactAwardNum = 4;
const sendingGoal = 100;

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
    // .then((response) => {
    //   res.json(response);
    // })
    .then((saveResponse) => {
      Chat.find({ sender }).then((result) => {
        const total = result.length;
        let contactsMade = 0;
        const contactsSeen = new Set();
        for (let i = 0; i < result.length; i += 1) {
          const currContact = result[i].receiver;
          if (contactsSeen.has(currContact.toString()) === false) {
            contactsMade += 1;
            contactsSeen.add(currContact.toString());
          }
          if (contactsMade === contactAwardNum) {
            break;
          }
        }
        if (contactsMade === contactAwardNum || total === sendingGoal) {
          Award.findOne({ userID: sender }).then((result3) => {
            if (contactsMade === contactAwardNum) {
              result3.messageThree = true;
            }
            if (total === sendingGoal) {
              result3.sentMessageGoal = true;
            }
            result3.save();
          });
        }
      });
      res.json(saveResponse);
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

export const totalSent = (req, res) => {
  Chat.find({ sender: req.params.id })
    .then((result) => {
      const total = result.length;
      res.json(total);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const totalContacted = (req, res) => {
  let contactsMade = 0;

  Chat.find({ sender: req.params.id }).then((result) => {
    const contactsSeen = new Set();
    for (let i = 0; i < result.length; i += 1) {
      const currContact = result[i].receiver;
      if (contactsSeen.has(currContact.toString()) === false) {
        contactsMade += 1;
        contactsSeen.add(currContact.toString());
      }
    }
  }).then((result2) => {
    res.json(contactsMade);
  });
};
