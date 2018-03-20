const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

// models
const Models = require('./models.js')

// helpers
const UserWorker = require('./UserWorker.js')

// memmory
const _posts = []
const _users = []

// Faked data
// imports
const AwesomeRandom = require('random-number-in-range')
const Faked = require('./faked.js')

// main fake function
const faker = () => {
  for (let i=0; i<20; i++) {
    let user = Models.user.create({name: Faked.getFakedName()})
    _users.push(user)
  }

  let usersIds = _users.map((item) => { return item.id })

  for (let i=0; i<_users.length; i++) {
    let id = _users[i].id
    let rawFollovers = []
    let rawFollowing = []

    for (let i=0; i<AwesomeRandom(1, 10); i++) {
      rawFollovers.push(usersIds[AwesomeRandom(1, usersIds.length - 1)])
    }

    for (let i=0; i<AwesomeRandom(1, 8); i++) {
      rawFollowing.push(usersIds[AwesomeRandom(1, usersIds.length - 1)])
    }

    let followers = new Set(rawFollovers)
    let following = new Set(rawFollowing)

    _users[i].followers = [...followers]
    _users[i].following = [...following]
  }

  for (let i=0; i<_users.length; i++) {
    let id = _users[i].id
    let counter = 0
    let counterStop = AwesomeRandom(1, usersIds.length - 1)
    let interval = setInterval(() => {
      let content = Faked.getFakedPost()
      let postData = {userId: id, content: content}
      let post = Models.post.create(postData)
      _posts.push(post)
      if (counter === counterStop) {
        clearInterval(interval)
      }
    }, 3000)
  }
}

// UNCOMMENT FAKER function below, if need fake data
// run faker
faker()

// api routes
// get all users
app.get('/users', (req, res) => {
  res.json(_users)
});

// get a user
app.get('/users/:id', (req, res) => {
  let user = _users.find((item) => { return parseInt(item.id) === parseInt(req.params.id)})
  // make user data
  if (user) {
    let userResponse = UserWorker.create(parseInt(req.params.id), _users, _posts)
    let userData = userResponse.getUserFullData()
    res.json(userData)
  } else {
    res.json('no user with id: ' + req.params.id)
  }
});

// follow user
app.post('/users/follow/:id', (req, res) => {
  // get user for adding follows
  let user = _users.find((item) => { return parseInt(item.id) === parseInt(req.params.id)})
  let userToFollow = _users.find((item) => { return parseInt(item.id) === parseInt(req.body.tofollow)})
  user.following.push(parseInt(req.body.tofollow))
  userToFollow.followers.push(parseInt(user.id))
  // make user data
  let userResponse = UserWorker.create(parseInt(req.params.id), _users, _posts)
  let userData = userResponse.getUserFullData()
  if (userData) {
    res.json(userData)
  } else {
    res.json('no user with id: ' + req.params.id)
  }
});

// unfollow user
app.post('/users/unfollow/:id', (req, res) => {
  // get user for adding follows
  let user = _users.find((item) => { return parseInt(item.id) === parseInt(req.params.id)})
  let userToUnFollow = _users.find((item) => { return parseInt(item.id) === parseInt(req.body.tounfollow)})
  // get indexes for deletion
  let idxRemoveFollowing = user.following.indexOf(parseInt(req.body.tounfollow))
  let idxRemoveFromFollowers = userToUnFollow.followers.indexOf(parseInt(user.id))
  // delete follows
  user.following.splice(idxRemoveFollowing, 1)
  userToUnFollow.followers.splice(idxRemoveFromFollowers, 1)
  // make user data
  let userResponse = UserWorker.create(parseInt(req.params.id), _users, _posts)
  let userData = userResponse.getUserFullData()
  if (userData) {
    res.json(userData)
  } else {
    res.json('no user with id: ' + req.params.id)
  }
});

// create a user
app.post('/users/create', (req, res) => {
  let user = Models.user.create(req.body)
  if (user) {
      _users.push(user)
      res.json(user)
  } else {
      res.json('something going wrong')
  }
});

// get all posts
app.get('/posts', (req, res) => {
  res.json(_posts)
});

// create a post
app.post('/posts/create', (req, res) => {
  if (req.body.content.length <= 100) {
      let post = Models.post.create(req.body)
      if (post) {
          _posts.push(post)
          res.json(post)
      } else {
          res.json('something going wrong')
      }
  } else {
    res.json('Post should be less than 100 characters :(')
  }
});

// server :)
app.listen(port)

console.log('Simple fun server started on: ' + port)
