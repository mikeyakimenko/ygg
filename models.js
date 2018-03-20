// Simple user model
class User {
  constructor(userData) {
    this.name = userData.name
    this.id = Math.floor(10000 + Math.random() * 90000)
    this.followers = []
    this.following = []
    this.posts = []
  }

  static create(userData) {
    return new User(userData)
  }
}

// Simple post model
class Post {
  constructor(postData) {
    this.content = postData.content
    this.id = Math.floor(10000 + Math.random() * 90000)
    this.userId = postData.userId
    this.date = new Date();
  }

  static create(postData) {
    return new Post(postData)
  }
}

module.exports = {
  user: User,
  post: Post
}
