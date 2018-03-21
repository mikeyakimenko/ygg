class buildUserResponse {
  constructor(userId, users, posts) {
    this.userId = userId
    this.users = users
    this.posts = posts
  }

  // helper for get followers or following
  filterUsersFromIds(idsArray) {
    return this.users.filter((item) => { return idsArray.includes(item.id) })
  }

  // get User
  getUser() {
    return this.users.find((item) => { return parseInt(item.id) === parseInt(this.userId)})
  }

  // get followers
  getFollowers() {
    let user = this.getUser()
    let followers = this.filterUsersFromIds(user.followers)
    return followers.map((item) => { return item.name })
  }

  // who following
  getFollowing() {
    let user = this.getUser()
    let following = this.filterUsersFromIds(user.following)
    return following.map((item) => { return item.name })
  }

  // make a feed of all posts
  createUserFeed() {
    let user = this.getUser()
    let userPosts = this.posts.filter((item) => { return item.userId === parseInt(this.userId) })
    let userFollowing = this.posts.filter((item) => { return user.following.includes(item.userId) })
    let rawFeed = userPosts.concat(userFollowing)
    let feed = rawFeed.map((item) => {
      let user = this.users.find((user) => { return parseInt(user.id) === parseInt(item.userId) })
      let userData = {
        name: user.name,
        id: item.userId
      }
      item.user = userData
      delete item.userId
      return item
    })
    feed.sort((a, b) => { return new Date(a.date) - new Date(b.date) })
    return feed.reverse()
  }

  // object for send to final API and makes user profile (for front-end)
  getUserFullData() {
    let user = this.getUser()
    return {
      id: user.id,
      name: user.name,
      posts: this.posts,
      followers: this.getFollowers(),
      following: this.getFollowing(),
      feed: this.createUserFeed()
    }
  }

  static create(userId, users, posts) {
    return new buildUserResponse(userId, users, posts)
  }
}

module.exports = buildUserResponse
