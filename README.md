# Ygg fun project

how to run:
– require NodeJS v6.10+

install: `yarn install`
run:     `yarn run start` or `yarn run live` for development
will running on [localhost:3000](//localhost:3000)

### Faked data

If you want Faked all data, just uncomment `faker()` function, Line 69 and start server, it will create faked users, makes they follow each other and makes some posts.

### Endpoints

**'/users'** – get all users

get request

<hr>

**'/users/:id'** – get a user

get request, require ID (number)

<hr>

**'/users/follow/:id'** – user with id follow another user

post request, require ID user who wants follow in url params and ID target user in body

example: user.id.0 follow user.id.1

```
/users/follow/0

{
  "tofollow": 1
}
```

<hr>

**'/users/unfollow/:id'** – user with id unfollow another user

post request, require ID user who wants unfollow in url params and ID target user in body

example: user.id.0 unfollow user.id.1

```
/users/follow/0

{
  "tounfollow": 1
}
```

<hr>

**'/users/create'** – create a users

post require, require username in request body

example create user 'Eugeniy'

```
/users/create

{
  {"name" : "Eugeniy"}
}
```

<hr>

**'/posts'** – get all posts

get request

<hr>

**'/posts/create'** – create a post (message)

post request, require user ID and content less than 100 characters

example will create post for user.id.1

```
/posts/create

{
  "content": "First post, about kittens",
  "userId": 1
}
```
