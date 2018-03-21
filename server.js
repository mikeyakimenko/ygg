const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
const AwesomeRandom = require('random-number-in-range')

app.use(bodyParser.json())

// models
const Models = require('./models.js')

// helpers
const UserWorker = require('./UserWorker.js')
const makeListOfIds = (itemsarray) => itemsarray.map((item) => { return item.id })
const addFollows = (usrId, usersIds) => {

  let follows = []

  let uniqueAddFollows = (usrId, usersIds, follows) => {
    let _id = usersIds[(Math.floor(Math.random() * usersIds.length) + 1) - 1]

    if (_id !== usrId && !follows.includes(_id)) {
      follows.push(_id)
    } else {
      uniqueAddFollows(usrId, usersIds, follows)
    }
  }

  for (let i=0; i<AwesomeRandom(1, 20); i++) {
    uniqueAddFollows(usrId, usersIds, follows)
  }

  return follows
}

// memmory
const _posts = []
const _users = []

// Faked data
const Faked = require('./faked.js')

const faker = () => {
  for (let i=0; i<Math.floor(Math.random() * 31) + 50; i++) {
    let user = Models.user.create({name: Faked.getFakedName()}, makeListOfIds(_users))
    _users.push(user)
  }

  let usersIds = makeListOfIds(_users)

  for (let i=0; i<_users.length; i++) {
    let user = _users[i]

    let followers = addFollows(user.id, usersIds)
    let following = addFollows(user.id, usersIds)

    user.followers = [...followers]
    user.following = [...following]
  }

  for (let i=0; i<_users.length; i++) {
    let user = _users[i]

    for (let j=0; j<AwesomeRandom(20); j++) {
      let content = Faked.getFakedPost()
      let postData = {userId: user.id, content: content}
      let post = Models.post.create(postData, makeListOfIds(_posts))
      _posts.push(post)
      user.posts.push(post.id)
    }
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
  let user = Models.user.create(req.body, makeListOfIds(_users))
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
      let post = Models.post.create(req.body, makeListOfIds(_posts))
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
