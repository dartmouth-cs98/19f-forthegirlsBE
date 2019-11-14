# For the Girls

We are building a mentorship platform for women in tech to connect and develop mentor/mentee relationships

## Architecture

Heroku URL: https://for-the-girls.herokuapp.com/

**Libraries Used** We used MongoDB and Mongoose to store and interact with our data and express.js to communicate with our database from the frontend. We are currently using passport as our authentication library.

### Our API

**Code Organization** So far, we have two schemas to organize the data in our database.

* **Users** Stores relevant information for each user including basic information and the result of their onboarding survey. 
* **Events** Stores the events users can post to the app for other women to attend.

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
