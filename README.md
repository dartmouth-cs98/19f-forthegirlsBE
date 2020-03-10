# For the Girls

We are building a mentorship platform for women in tech to connect and develop mentor/mentee relationships.

## Architecture

Heroku URL: https://for-the-girls.herokuapp.com/

**Libraries Used** We used MongoDB and Mongoose to store and interact with our data and express.js to communicate with our database from the frontend. We are currently using passport as our authentication library.

### Our API

**Code Organization** So far, we have seven schemas to organize the data in our database. Each of these Schemas has a corresponding controller which holds the appropriate functions for each end point, which enables our front-end to receive the appropriate information for each request. This includes things like updating user profiles and creating new events.

* **Users** Stores relevant information for each user including email, username, password and all the results their onboarding survey. Handles the following endpoints:
  * Sign up: POST on '/signup' that takes username, password and email as fields "username," "password," and "email" in the body of the request and adds a user object to the database. Returns a token object.
  * Sign in: POST on '/signin' that takes the username and password as fields "username" and "password" in the body of the request. Returns a token object.
  * Get user: GET on 'users/:id' where the "id" segment of the endpoint is the ID of the relevant user. Returns the appropriate user object.
  * Edit user: PUT on 'users/:id' where the "id" segment of the endpoint is the username of the relevant user and the body of the request contains fields that should be changed.
  * Add to survey: PUT on 'users/survey/:id' where "id" segment of endpoint is ID of user whose survey is being modified and the body of the request contains the fields of the survey that are being added. Returns modified user object.

* **Matches** Represents matches that have been made between user pairs. Matches are stored as ID's referencing each user. Handles the following endpoints:
  * Pair users: POST on '/matches/pair' that takes user1 and user2 usernames in the body of the request as fields "user1" and "user2" and creates a new Match in the database representing this pair. Prevents duplicate matches regardless of order.
  * Reject match: POST on '/matches/reject' that takes a user1 and user2 usernames in the body of the request as fields "user1" and "user2" and removes each user as potential match for the other. Returns message indicating that match has been rejected.
  * Delete match: DELETE on '/matches/delete/:id' where "id" segment of the endpoint is the id of the match to be deleted. Returns message indicating that match has been deleted.
  * Get match ID: GET on '/matches/getid/:id1/:id2" where "id1" segment is the ID of one user and "id2" segment is the ID of another user. Returns the ID of the match representing the relationship between the two users.
  * Get matches: GET on 'matches/:id' where the "id" segment of the endpoint is username of the relevant user. Returns an array of ID's representing the user objects with which the relevant user has been paired.
  * Get potential matches: GET on 'matches/potential/:id' where the "id" segment of the endpoint is username of the relevant user. Returns an array of ID's representing the user objects with which the relevant user has NOT been paired (this represents potential users).

* **Events** Stores the information relevant to each event users can post to the app for other women to attend, including rsvps and logistical information. Handles the following endpoints:
  * Get events: GET on '/events/' where it  returns a list of all the events in our database.
  * Add event: POST on '/events/add' where the "title", "date", "time", "location", and "description" are saved in the body of the request and adds the event object to the database. Returns modified event object.
  * Get event: GET on '/events/:id' where the "id" segment of the endpoint is the ID of the relevant user. Returns the corresponding event object
  * RSVP event: POST on '/events/rsvp/:id' where the "id" segment of the endpoint is the ID of the relevant event, and the ID of the user that has RSVP'd is saved in the body of the request as "userID". Fetches the relevant event and adds the user's ID to the event's list of RSVPs. Returns the modified event object.
  * UNRSVP event: POST on 'events/unrsvp/:id' where the "id" segment of the endpoint is the ID of the relevent event, and the ID of the user that has UNRSVP'd is saved in the body of the request as "userID." Removes the user's ID from the event's list of RSVPs. Returns the length of the new RSVP list.
  * Get RSVP count: GET on 'events/rsvp/count/:id' where "id" segment of the endpoint is the ID of the relevant event. Returns the number of users RSVP'd to the event.
  * Get your RSVP's: GET on '/events/rsvp/your/:id' where "id" is the user ID of the relevant user. Returns an array of all upcoming event objects that the relevent user is RSVP's to.
  * Get connection RSVP's: GET on 'events/rsvp/connections/:userId/:eventId' where "userID" segment of endpoint is the ID of the relevant user and "eventID" segment of endpoint is the ID of the relevant event. Returns all users the user is matched with that are RSVP'd to the given event.


* **Chats** Represents chats that have been sent between user pairs. Chats hold the sender ID, receiver ID, the text itself, timestamp, and whether the receiver has read the chat. Handles the following endpoints:
  * Add chat: POST on 'chats/add'. The body contains sender ID, receiver ID and text. Timestamp is created as in the backend using the current timestamp. Creates the chat and adds to the database. Changes award field to true for messaging three separate users or sending 100 chats total if appropriate.
  * Get between: GET on 'chats/getBetween/:id1/:id2'. Returns all the messages between users at id1 and id2, ordered by timestamp.
  * Get to from: GET on 'chats/getToFrom/:id1/:id2'. Returns all messages from id1 to id2, ordered by timestamp.
  * Load more: GET on 'chats/loadMore/:id1/:id2/:loadNum'. Returns the number of chats between id1 and id2 specified by the "loadNum" parameter, ordered by timestamp.
  * Total sent: GET on 'chats/totalSent/:id'. Returns the number of chats the user with this ID has been labeled the sender on.
  * Total contacted: GET on 'chats/totalContacted/:id'. Returns the number of other users the user with this ID has contacted.
  * Get my unread count: GET on 'chats/getMyUnreadCount/:id'. Returns the number of chats the user with this ID is listed as the receiver that are false in the "receiverRead" variable.
  * Get my unread with IDs: GET on 'chats/getMyUnreadWithIds/:id'. Returns the list of users the user with this ID has unread chats from.
  * Set to read: PUT on 'chats/setToRead'. Gets receiver and sender IDs from the body of the request and fetches chats from sender to receiver. Orders by reverse timestamp so the most recent are first in the fetch result. Then loops through and sets "receiverRead" to true until it hits the earliest chat that is already true.

* **Awards** Represents awards which users have received during their time on the app. Awards consist of the ID of the user they represent and boolean fields for each award you can obtain. Handles the following endpoints:
  * Check award: GET on '/awards/checkAward/:id/:awardTitle'. Looks up the award object for the user with this id and returns true or false depending on the value of the award specified by "awardTitle".
  * Check all awards: GET on ''/awards/checkAllAwards/:id'. Finds the award object associated with the user with this id. Returns a list with true and false values in the same order as the award fields listed in the schema.

* **Blacklists** Represents both reports and blocks on the app. Stores the ID of the reporter, the ID of the reported and then two boolean variables, one for blocking and one for reporting. Handles the following endpoints:
  * Report: PUT on 'blacklist/report/:reporterID/:reportedID'. Finds or creates a blacklist object between these two users and sets the report field to true.
  * Block: PUT on 'blacklist/block/:reporterID/:reportedID'. Finds or creates a blacklist object between these two users and sets the report field to true. Then deletes the Match object with these two users (so they cannot rematch with each other) and all their chats.

* **Activities** Represents user activity on the app. The schema holds a user's ID, timestamps of all their log ins, their last log in, and the "day streak" of days they have signed in to their account in a row. Handles the following endpoints:
  * Add activity: PUT on '/activity/add/:id'. Finds the activity associated with this user's id. Push current timestamp to the allLogins list. Changes last login to the current timestamp. Updates days in a row of visiting the app appropriately.

Procfile set up to run on [heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)

## Setup

First, `brew install mongodb` if you don't have it installed already.
Then, run `yarn install` to get your node modules up to date, and `yarn dev` to start the server from your local machine. You will most likely also need to have a mongo server, started by running `mongod &`, running in the backgroud when testing with a local server.

## Deployment

To deploy to our heroku server, you can push the backend to heroku with `git push heroku master`.

## Authors

Alexis Harris, Annika Kouhia, Frances Cohen, Morgan Sorbaro, Sami Burack

## Acknowledgments

Thank you to Tim for all your support and the CS 52 website for great resources!
