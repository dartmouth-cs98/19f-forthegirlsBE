# For the Girls

We are building a mentorship platform for women in tech to connect and develop mentor/mentee relationships.

## Architecture

Heroku URL: https://for-the-girls.herokuapp.com/

**Libraries Used** We used MongoDB and Mongoose to store and interact with our data and express.js to communicate with our database from the frontend. We are currently using passport as our authentication library.

### Our API

**Code Organization** So far, we have two schemas to organize the data in our database.

* **Users** Stores relevant information for each user including email, username, password and all the results their onboarding survey. Handles the following endpoints:
    * Sign up: POST on '/signup' that takes username, password and email as fields "username," "password," and "email" in the body of the request and adds a user object to the database. Returns a token object.
    * Sign in: POST on '/signin' that takes the username and password as fields "username" and "password" in the body of the reqest. Returns a token object.
    * Get user: GET on 'users/:id' where the "id" segment of the endpoint is the ID of the relevant user. Returns the appropriate user object.
    * Edit user: PUT on 'users/:id' where the "id" segment of the endpoint is the username of the relevant user and the body of the request contains fields that should be changed.
* **Events** Stores the events users can post to the app for other women to attend.

* **Matches** Represents matches that have been made between users (mentor/mentee pairs). Matches are stored as ID's referencing each user. Handles the following endpoints:
    * Pair users: POST on '/matches/pair' that takes a user1 and user2 usernames in the body of the request as fields "user1" and "user2" and creates a new Match in the database representing this pair. Prevents duplicate matches regardless of order.
    * Get matches: GET on 'matches/:id' where the "id" segment of the endpoint is username of the relevant user. Returns an array of ID's representing the user objects with which the relevant user has been paired.
    * Get potential matches: GET on 'matches/potential/:id' where the "id" segment of the endpoint is username of the relevant user. Returns an array of ID's representing the user objects with which the relevant user has NOT been paired (this represents potential users).

Each of these Schemas has a corresponding controller which holds the appropriate functions for each end point, which enables our front-end to receive the appropriate information for each request. This includes things like updating user profiles and creating new events.

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
