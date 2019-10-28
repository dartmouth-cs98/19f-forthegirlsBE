import { Router } from 'express';
import * as UserController from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our api!' });
});
router.post('/signup', UserController.signup);
router.get('/users/:id', UserController.getUser);

// /your routes will go here

export default router;
