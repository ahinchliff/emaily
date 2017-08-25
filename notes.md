# App - Node, Express, React, React Router, Redux

## Express Setup and Deployment

### App Setup
1 - Install express
```
npm install express
```

2 - Create ```index.js``` file in the root diretory. Import the express module and created a new express app object and assign it to the const ```app```. The ```app``` object represents the underlying express server. 

```javascript
const express = require('express');
const app = express();
```
3 - Create a get route handler. A route handler takes a route (/) and a callback that will be called whenever a get request is made to that route. 

```javascript
app.get('/', (req, res) => {
  res.rend({ hi: 'there' });
});
```

4 - Call the `listen` method on `app` to tell node which port to listen to. 

```javascript
app.listen(5000);
```

*Completed /index.js*
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send({ hi: 'there' });
});

app.listen(5000);
```


### Deployment to Heroku

**CheckList** 

1 - Dynamic Port Binding - Heroku determines which port the app will use so code needs to use a dynamic variable rather than a static value. Node has a config object ```process.env``` that Heroku modifies to set the port. The port that Heroku has allocated the your app can be found at ```process.env.PORT```. This property will not be set in development so a boolean statement should be used to ensure the app runs on a local machine. 

```javascript
// index.js
const PORT = process.env.PORT || 5000;
app.listen(PORT);
```

2 - Specify Node Enviroment - Tell Heroku the version of node the app is using. Inside `package.json` add the property 
```javascript
"engines" : {
  "node": "8.1.1",
  "npm": "5.0.3"
}
```

3 - Specify start script - Tell Heroku how to start the node server. Inside `package.json` modify the `scripts` property to read:
```javascript
"scripts": {
  "start": "node index.js"
}
```

4 - Create a .gitignore file - Do not upload  dependencies to Git or Heroku. (Heroku will install the dependencies itself). Create a `.gitignore` file with the line `node_modules`. 


**Deployment Steps**

1 - Commit project to git
```
$ git init
$ git add .
$ git commit -m "initial commit"
```

2 - Create a new Heroku app which will return two links. The first the live app url and the second the remote repo to sync the local git repo with. 
```
$ heroku create
```

3 - Register a remote repo called `heroku` using remote repo url. 
```
$ git remote add heroku https://git.heroku.com/arcane-ravine-96878.git
```

4 - Deloy the application to Heroku
```
$ git push heroku master
```

***Future Deployments***

1 - Commit all changes to git

```
$ git add .
$ git commit -m "changes"
```

2 - Push changes to Heroku
```
$ git push heroku master
```

## Nodemon Setup
Nodemon is a module that automatically restarts the server when files are changed. 

1 - Install nodemon
```
$ npm install --save nodemon
```

2 - Add a script to package.json that automatically starts nodemon.js when the server starts. Scripts can be run by npm. For example `npm run dev` would run `nodemon index.js` in the code below. 
```javascript
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
```

## MongoDB

### MongoDB Remote Setup

1 - Create a new database and database user on mLab. 
2 - Install Mongoose
```
$ npm install --save mongoose
```
3 - In `index.js` require the mongoose library
```javascript
const mongoose = require('mongoose');
```
4 - Add the mLab mongodb uri to `config/keys.js` and add in the login details. 
```javascript
module.exports = {
  mongoURI: 'mongodb://admin_user:password@ds159013.mlab.com:59013/emaily-dev'
};
```
5 - Import `keys.js` into `index.js`.
```javascript
const keys = require('./config/keys');
```

6 - Connect mongoose to the mLab database in `index.js`
```javascript
mongoose.connect(keys.mongoURI);
```

### Creating Mongoose Models

1 - Create a new file `models/User.js`.

2 - In `User.js` require the mongoose library. 
```javascript
const mongoose = require('mongoose');
```

3 -  Assign the schema property of the mongoose library to a variable.  
```javascript
const { Schema } = mongoose;
```

4 - Create a new schema that describes all the properties a user record will have. 
```javascript
const userSchema = new Schema({
  googleId: String,
});
```
5 - Tell mongoose to create a collection in the database by running the `model` method. The first argument is the name of the collection, the second argument is which schema to use.
```javascript
mongoose.model('users', userSchema);
```

6 - In `index.js` require `models/User.js`.
```javascript
require('./models/User');
```


## Authentication

### Passport Setup

Passport is made up of two library components:

1. passport - general functions, objects and helps that make auth in Express easy. 

2. passport strategy - Helpers for authentica ting with specific methods(email, facebook, google). 


1 - Install passport and required strategy
```
$ npm install -save passport passport-google-oauth20
```

2 - Require passport and the strategy in `index.js`. 
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
```

3 - Get client ID and client secret from dev.google for new app. 

*---STEPS 4 and 5 are for initial dev setup. See below for more robust key security---*

4 - Create a new file `config/keys.js` and add in clientID and secret
```javascript
module.exports = {
  googleClientID: '[id]',
  googleClientSecret: '[secret]'
}
```

5 - Stop git from committing `config/keys.js` by adding the following line to `.gitignore`
```
keys.js
```

6 - Import keys into `index.js`.
```
const keys = require('./config/keys');
```

7 - Tell the passport library which strategy to use in `index.js`. The `GoogleStrategy` function call takes a options object and a callback function. 

The options object needs to include the client id, client secret and a callback URL. The callback URL is to tell google which url to forward users to once they have granted or not granted permission. This must match a Authorized redirect URI on dev.google.  

The callback function passed in will be run once a user successfully granted permission, passport and google request and reply a few times, and finally google replies with the reuqested information (see step 8 for the requested information). This callback is where the logic for saving a new users data to a database happens. 


```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile,done });
    }
  )
);
```

8 - Add a route handler to start the OAuth process. In `index.js`. When a user visits `/auth/google`, express will run the passport `authenticate` function. Passport's `authenticate` function takes two arguments:

1. A string that tells Passport which strategy to use. For example 'google' (The strategy `passport-google-oauth20` calls itself google internally).
2. An options object that tells passport which information we want to ask Google for. 

```javascript
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
```

9 - Add another route handler for the url that google forwards users to once they have granted permission. Again, when this url is requested, the passport `authenticate` method will be called and will run the strategy that is associated with the passed in string. This time, the incoming request will include a query string with a key `code`. Passport's `authenticate` method with see this code and run the callback function supplied when setting up the google strategy in step 7.   
```javascript
app.get('/auth/google/callback', passport.authenticate('google'));
```

10 - The route `/auth/google` should now redirect to Google servers, allow a user to grant permission and print the code returned by google to the console. You may also see an error. 

```javascript
// index.js

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken) => {
      console.log(accessToken);
    }
  )
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
```

### Passport refactoring
Once the auth system is working it is best to move the logic out of `index.js`. 

1 - Create a new file `routes/authRoutes.js` and inside place the two routes that handle Passport's auth flow from `index.js`. This file will also require reference to the passport module.
```javascript
const passport = require('passport');

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback', passport.authenticate('google'));
```

2 - Notice that in `routes/authRoutes.js`, `app` is referenced but never imported. `App` is a constant in `index.js` So that we can load our routes into the app, we want `routes/authRoutes.js` to export a function that takes an `app` as an argument and attaches these routes to the app. Update `routes/authRoutes.js` to...
```javascript
const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );  

  app.get('/auth/google/callback', passport.authenticate('google'));
}
```

and in `index.js` add the following
```javascript
require('./routes/authRoutes')(app);
```

3 - Create a `services/passport.js` and place inside the passport config code (`passport.use()`) from `index.js`.

```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile,done });
    }
  )
);
```

4 - Cut the three passport related import statements from `index.js` and place them at the top of `services/passport.js`. The require statement for the config keys needs to be updated.
```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
```

5 - In `index.js` import the passport config file created in step 2. 
```javascript
require('./services/passport.js');
```

**At the end**
```javascript
/// index.js
const express = require('express');
require('./services/passport.js');

const app = express();
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
```

```javascript
/// routes/authRoutes.js
const passport = require('passport');

module.exports = app => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );  

  app.get('/auth/google/callback', passport.authenticate('google'));
}
```

```javascript
/// services/passport.js
const passport = require('passport');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile,done });
    }
  )
);
}
```

### Connecting Passport to database

1 - In `passport.js`, require in the mongoose libary and the user model class. 
```javascript
const mongoose = require('mongoose');
const User = mongoose.model('users');
```

2 - In the callback function passed into `passport.use`, create a new user instance and save it to the database with the their googleid == profileid. Profile id is returned by google when a user grants permission and passport requests user data. 

```javascript
new User({ googleId: profile.id }).save();
```

**A new user should be saved to the database everytime `/localhost:5000/auth/google` is visited**

3 - Need to check if a user already exists. Create a new user if doesn't exist.

```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne( { googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            //user exists
          } else {
            //save new user
            new User({ googleId: profile.id }).save();
          }
        })
    }
  )
);
```

4 - Tell passport to continue auth proccess once a user is created or a previous user is validated. This is done using the `done` function, passed into the `passport.use` method. 

```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
      User.findOne( { googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({ googleId: profile.id })
              .save()
              .then(user => done(null, user));
          }
        });
    }
  )
);
```

### Logining in
1 - In `passport.js`, provide a callback to `passport.serializedUser` that takes a user and the passport done callback. 
```javascript
passport.serializeUser((user, done) => {
  done(null, user.id);
});
```

2 - In `passport.js` provide a callback to `passport.deserializeUser`.

```javascript
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});
```

3 - Install the cookie-session library
```
$ npm install --save cookie-session
```

4 - In `index.js`
```javascript
const cookieSession = require('cookie-session');
const passport = require('passport');
```

5 - In `index.js`
```javascript
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
```


6 - Add a new cookie key to `config/keys/js`
```javascript
{
  cookieKey: "wq28347932498214790128fnsdfhg4h"
}
```

7 - Tell passport to use cookies. In `index.js`
```javascript
app.use(passport.session());
app.use(passport.initialize());
```

### Setup userlogout

1 - Create a new route to handle the logout logic in `routes/authRoutes/js`.

```javascript
app.get('/api/logout', (req, res) => {
    req.logout();
});
```

























