/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import User from '../models/user_model';

// eslint-disable-next-line consistent-return
export const signup = (req, res, next) => {
  const { username } = req.body;

  User.findOne({ username }).then((result) => {
    if (result != null) {
      return res.status(425).send('User exists with the username provided.');
    } else {
      const user = new User();
      user.username = username;
      user.matches = [];
      user.save()
        .then((resp) => {
          res.send('user has been added');
        })
        .catch((error) => {
          console.log(error);
          return res.status(555).send('Problem adding user');
        });
    }
  });
};

export const getUser = (req, res) => {
  console.log(req);
  const { username } = req.params.id;

  User.findOne({ username }).populate('matches').then((result) => {
    console.log(result);
    res.json({ result });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};
