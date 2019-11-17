import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as MatchesController from './controllers/matches_controller';
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
// router.put('/users/pair/:id', UserController.pairUser);
router.post('/matches/pair', MatchesController.addMatch);
router.get('/matches/:id', MatchesController.getPotentialMatches);
router.get('/events/', EventController.getEvents);
router.post('/events/add', EventController.addEvent);
router.get('/events/:id', EventController.getEvent);
router.post('/events/rsvp/:id', EventController.rsvpEvent);
router.put('/users/survey/:id', UserController.addToSurvey);

export default router;
