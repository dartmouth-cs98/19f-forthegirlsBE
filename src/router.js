import { Router } from 'express';
import * as UserController from './controllers/user_controller';
import * as MatchesController from './controllers/matches_controller';
import * as EventController from './controllers/event_controller';
import * as ChatController from './controllers/chat_controller';
import * as AwardController from './controllers/award_controller';
import * as BlacklistController from './controllers/blacklist_controller';
import * as ActivityController from './controllers/activity_controller';

import { requireSignin } from './services/passport';
import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our api!' });
});
router.get('/getAPI', EventController.getAPI);
router.post('/signup', UserController.signup);
router.post('/signin', requireSignin, UserController.signin);
router.get('/users/:id', UserController.getUser);
router.put('/users/:id', UserController.editUser);
router.post('/matches/pair', MatchesController.addMatch);
router.post('/matches/reject', MatchesController.rejectPotentialMatch);
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
router.get('/events/rsvp/your/:id', EventController.getYourRsvps);
router.get('/events/rsvp/connections/:userId/:eventId', EventController.getConnectionRsvps);
router.post('/chats/add', ChatController.addChat);
router.get('/chats/getBetween/:id1/:id2', ChatController.getBetween);
router.get('/chats/getToFrom/:id1/:id2', ChatController.getToFrom);
router.get('/chats/loadMore/:id1/:id2/:loadNum', ChatController.loadMore);
router.get('/chats/totalSent/:id', ChatController.totalSent);
router.get('/chats/totalContacted/:id', ChatController.totalContacted);
router.get('/chats/getMyUnreadCount/:id', ChatController.getMyUnreadCount);
router.get('/chats/getMyUnreadWithIds/:id', ChatController.getMyUnreadWithIds);
router.put('/chats/setToRead', ChatController.setToRead);
router.get('/awards/checkAward/:id/:awardTitle', AwardController.checkAward);
router.get('/awards/checkAllAwards/:id', AwardController.checkAllAwards);
router.put('/users/survey/:id', UserController.addToSurvey);
router.put('/blacklist/report/:reporterID/:reportedID', BlacklistController.report);
router.put('/blacklist/block/:reporterID/:reportedID', BlacklistController.block);
router.put('/activity/add/:id', ActivityController.addActivity);
router.get('/sign-s3', signS3);


export default router;
