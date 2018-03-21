// class helpers
const randomID = (idsArray) => {
  // let idsArr =
  let randomNumber = () => { return Math.floor(10000 + Math.random() * 90000) }
  let generateID = (_id, _ids) => {
    return _ids.includes(_id) ? generateID(randomNumber(), _ids) : _id
  }

  return generateID(randomNumber(), idsArray)
}

// Simple user model
class User {
  constructor(userData, usersIds) {
    this.name = userData.name
    this.id = randomID(usersIds)
    this.followers = []
    this.following = []
    this.posts = []
  }

  static create(userData, usersIds) {
    return new User(userData, usersIds)
  }
}

// Simple post model
class Post {
  constructor(postData, postsIds) {
    this.content = postData.content
    this.id = randomID(postsIds)
    this.userId = postData.userId
    this.date = new Date();
  }

  static create(postData, postsIds) {
    return new Post(postData, postsIds)
  }
}

module.exports = {
  user: User,
  post: Post
}
