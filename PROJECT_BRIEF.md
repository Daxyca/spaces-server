# Spaces Project Brief

## 1. Project Overview

**Goal**: Build Spaces, a social media site where users can interact with others and create their custom spaces.

## 2. Core Features (MVP)

### Must-have:

- User registration and login via username and password _[a]_
- Users can send follow requests to other users
- Users can create text posts
- Users can like posts
- Users can comment on posts
- Posts should display post content, author, comments, and likes
- Index page for posts showing all posts from current user and followed users _[b]_
- Users can create a profile with their personal details and a profile picture _[c]_
- User's profile page should contain profile information, profile photo, and posts
- Index page for users, which shows all users and buttons for sending follow requests or indication of pending follow request
- Users can create custom spaces _[b]_

### Nice-to-have:

- User registration and login via github account _[a]_
- Use github account profile picture _[c]_
- Send messages to other users

## 3. Data Model

### Must-have:

```
User {
  id, username, email, passwordHash, createdAt, updatedAt, Profile?,
}

Follow {
  status{Pending, Accepted}, createdAt, updatedAt, following(Profile.id), follower(Profile.id),

  @@id([followerId, followingId]),
}

Profile {
  id=user.id, user(User.id), displayName,
  posts[Post], comments[Comment],
  likedPosts[Post], likedComments[Comment],
  following[Follow], followers[Follow],
  spacesCreated[Space], spacesIncluded[Space],
  createdAt, updatedAt,
  picture?, firstName?, lastName?, birthDate?, bio?, sexAtBirth?, location?,
}

Post {
  id, author(Profile.id), content, createdAt, updatedAt,
  likes[Profile], comments[Comment],
}

Comment {
  id, author(Profile.id), post(Post.id), content, createdAt, updatedAt, likes[Profile],
}

Space {
  id, name, createdAt, updatedAt, author(Profile.id), users[Profile],
}
```

### Nice-to-have:

**Messages**

```
Profile.extend {
  sentMessages[Message], receivedMessages[Message],
}

Message {
  id, content, createdAt, updatedAt, sender(Profile.id), receiver(Profile.id),
}
```

## 4. API Endpoints

|              | Method | Route                          | Description                                            | Auth Required |
| ------------ | ------ | ------------------------------ | ------------------------------------------------------ | ------------- |
| **Auth**     |
|              | POST   | /api/auth/register             | Create a new user                                      | X             |
|              | POST   | /api/auth/login                | Log in                                                 | X             |
|              | GET    | /api/auth/login                | Re-fetch user info                                     | Yes           |
|              | DELETE | /api/auth/logout               | Delete current user session                            | Yes           |
| **Follow**   |
|              | POST   | /api/follow/following/:userId  | Send follow request                                    | Yes           |
|              | PATCH  | /api/follow/follower/:userId   | Accept follow request                                  | Yes           |
|              | DELETE | /api/follow/following/:userId  | Cancel pending follow request or unfollow              | Yes           |
|              | DELETE | /api/follow/follower/:userId   | Decline a follow request or remove a follower          | Yes           |
|              | GET    | /api/follow/following          | Get list of current user's followed users              | Yes           |
|              | GET    | /api/follow/followers          | Get list of current user's followers                   | Yes           |
|              | GET    | /api/follow/following/requests | Get list of current user's pending following requests  | Yes           |
|              | GET    | /api/follow/followers/requests | Get list of current user's pending followers requests  | Yes           |
|              | GET    | /api/follow/notfollowing       | Get list of current user's not followed users          | Yes           |
| **Post**     |
|              | GET    | /api/posts                     | Get list of posts from current user and followed users | Yes           |
|              | POST   | /api/posts                     | Create a new post                                      | Yes           |
|              | GET    | /api/posts/:postId             | Get a post                                             | Yes           |
|              | PUT    | /api/posts/:postId             | Update a post                                          | Yes           |
|              | POST   | /api/posts/:postId/like        | Add like on a post                                     | Yes           |
|              | DELETE | /api/posts/:postId/like        | Remove like on a post                                  | Yes           |
|              | POST   | /api/posts/:postId/comments    | Create a comment on a post                             | Yes           |
| **Comments** |
|              | PUT    | /api/comments/:commentId       | Update a comment                                       | Yes           |
|              | DELETE | /api/comments/:commentId       | Delete a comment                                       | Yes           |
| **Profile**  |
|              | GET    | /api/profile                   | Get current user's profile                             | Yes           |
|              | PATCH  | /api/profile                   | Update current user's profile                          | Yes           |
|              | GET    | /api/profile/:userId           | Get specific user's profile                            | Yes           |
| **Space**    |
|              | GET    | /api/spaces                    | Get list of current user's spaces                      | Yes           |
|              | POST   | /api/spaces                    | Create custom space                                    | Yes           |
|              | GET    | /api/spaces/:spaceId           | Get posts from custom space                            | Yes           |
|              | PATCH  | /api/spaces/:spaceId           | Update custom space                                    | Yes           |
|              | DELETE | /api/spaces/:spaceId           | Delete custom space                                    | Yes           |

### Temporarily Disabled Endpoints

|              | Method | Route                         | Description              | Auth Required |
| ------------ | ------ | ----------------------------- | ------------------------ | ------------- |
| **Comments** |
|              | POST   | /api/comments/:commentId/like | Add like on a comment    | Yes           |
|              | DELETE | /api/comments/:commentId/like | Remove like on a comment | Yes           |

## 5. Architecture & Tech Stack

- **Backend Framework**: Express
- **Database**: PostgreSQL with Prisma
- **Frontend**: React

## 6. Stretch Goals

- Deploy online
- Add tests
- Pagination
