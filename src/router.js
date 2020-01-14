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
router.get('/matches/getid/:id1/:id2', MatchesController.getMatchId);
router.get('/matches/:id', MatchesController.getMatches);
router.get('/matches/potential/:id', MatchesController.getPotentialMatches);
router.get('/events/', EventController.getEvents);
router.post('/events/add', EventController.addEvent);
router.get('/events/:id', EventController.getEvent);
router.post('/events/rsvp/:id', EventController.rsvpEvent);
router.post('/events/unrsvp/:id', EventController.unrsvpEvent);
router.get('/events/rsvp/count/:id', EventController.getRsvpCount);
router.post('/chats/add', ChatController.addChat);
router.get('/chats/getBetween/:id1/:id2', ChatController.getBetween);
router.get('/chats/getToFrom/:id1/:id2', ChatController.getToFrom);
router.get('/chats/loadMore/:id1/:id2/:loadNum', ChatController.loadMore);
router.put('/users/survey/:id', UserController.addToSurvey);

export default router;
