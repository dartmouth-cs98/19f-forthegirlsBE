import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as EventController from './controllers/event_controller';
import { requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our api!' });
});
router.post('/signup', UserController.signup);
router.post('/signin', requireSignin, UserController.signin);
router.get('/users/:id', UserController.getUser);
router.put('/users/:id', UserController.editUser);
router.put('/users/pair/:id', UserController.pairUser);
router.get('/users/matches/:id', UserController.getMatches);
router.delete('/users/pair/:id', UserController.deletePair);
router.post('/events/add', EventController.addEvent);

/** survey routes */
router.post('/survey/basicInfo/:id');
router.post('/survey/cs/:id');
router.post('/survey/demo/:id');
router.post('/survey/edu/:id');
router.post('/survey/personal/:id');

export default router;
