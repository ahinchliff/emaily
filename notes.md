## Basics Express App Setup and Deployment

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

***Additional Deployments***

1 - Commit all changes to git

```
$ git add .
$ git commit -m "changes"
```

2 - Push changes to Heroku
```
$ git push heroku master
```


