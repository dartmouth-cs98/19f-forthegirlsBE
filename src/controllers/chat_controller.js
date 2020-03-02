/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable new-cap */
import dotenv from 'dotenv';
// import { Expo } from 'expo';
import Expo from 'expo-server-sdk';
import User from '../models/user_model';
// import * as Permissions from 'expo-permissions';
import Chat from '../models/chat_model';
import Award from '../models/award_model';

const expo = new Expo();

dotenv.config({ silent: true });

const contactAwardNum = 4;
const sendingGoal = 100;

const sendMessage = (message, savedPushTokens) => {
  console.log('HERE IN SEND MESSAGE');
  const notifications = [];
  for (const pushToken of savedPushTokens) {
    console.log('push token:');
    console.log(pushToken);
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    notifications.push({
      to: pushToken,
      sound: 'default',
      title: 'Message received!',
      body: message,
      data: { message },
      badge: 1,
    });
    console.log('message');
    console.log(notifications);
  }
  const chunks = expo.chunkPushNotifications(notifications);
  (async () => {
    for (const chunk of chunks) {
      try {
        const receipts = await expo.sendPushNotificationsAsync(chunk);
        console.log(receipts);
      } catch (error) {
        console.error(error);
      }
    }
  })();
  // Defined in following step
};

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
  User.findById({ _id: receiver }).then((result) => {
    console.log(result);
    sendMessage(text, result.pushTokens);
  }).catch((error) => {
    res.status(500).json({ error });
  });
  chat.save()
  // add in sending notification logic if ncessary
  // call handle push tokens
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

export const getMyUnreadCount = (req, res) => {
  console.log(req.params.id);
  Chat.find({ receiver: req.params.id, receiverRead: false })
    .then((result) => {
      console.log(result);
      const unread = result.length;
      res.json(unread);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const getMyUnreadWithIds = (req, res) => {
  const boldIDs = [];
  const seen = new Set();
  Chat.find({ receiver: req.params.id, receiverRead: false })
    .then((result) => {
      for (let i = 0; i < result.length; i += 1) {
        const currContact = result[i].sender;
        if (seen.has(currContact.toString()) === false) {
          boldIDs.push(currContact.toString());
          seen.add(currContact.toString());
        }
      }
      console.log(boldIDs);
      res.json(boldIDs);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


export const setToRead = (req, res) => {
  Chat.find({ sender: req.body.senderID, receiver: req.body.receiverID })
    .sort('timestamp')
    .then((result) => {
      for (let i = 0; i < result.length; i += 1) {
        if (result[i].receiverRead === false) {
          result[i].receiverRead = true;
          result[i].save();
        } else {
          break;
        }
      }
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
