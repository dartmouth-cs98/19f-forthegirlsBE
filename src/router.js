import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as MatchesController from './controllers/matches_controller';
import * as EventController from './controllers/event_controller';
import * as ChatController from './controllers/chat_controller';
import { requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our api!' });
});
router.post('/signup', UserController.signup);
router.post('/signin', requireSignin, UserController.signin);
router.get('/users/:id', UserController.getUser);
router.put('/users/:id', UserController.editUser);
router.post('/matches/pair', MatchesController.addMatch);
router.delete('/matches/delete/:id', MatchesController.removeMatch);
router.get('/matches/:id', MatchesController.getMatches);
router.get('/matches/potential/:id', MatchesController.getPotentialMatches);
router.get('/events/', EventController.getEvents);
router.post('/events/add', EventController.addEvent);
router.get('/events/:id', EventController.getEvent);
router.post('/events/rsvp/:id', EventController.rsvpEvent);
router.post('/events/unrsvp/:id', EventController.unrsvpEvent);
router.post('/chats/add', ChatController.addChat);
router.get('/chats/getBetween', ChatController.getBetween);
router.put('/users/survey/:id', UserController.addToSurvey);

export default router;
