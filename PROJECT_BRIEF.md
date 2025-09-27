# Spaces Project Brief

## 1. Project Overview

**Goal**: Build Spaces, a social media site where users can interact with others and create their custom feeds.

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
- Users can create custom feeds _[b]_

### Nice-to-have:

- User registration and login via github account _[a]_
- Use github account profile picture _[c]_
- Send messages to other users

## 3. Data Model

### Must-have:

```
User {
  id, username, email, passwordHash, createdAt, Profile?,
}

Follow {
  status{Pending, Accepted}, createdAt, following(Profile.userId), follower(Profile.userId),

  @@id([followerId, followingId]),
}

Profile {
  user(User.id), userId@id, displayName,
  posts[Post], comments[Comment],
  likedPosts[Post], likedComments[Comment],
  following[Follow], followers[Follow],
  feedsCreated[Feed], feedsIncluded[Feed],
  picture?, firstName?, lastName?, birthDate?, bio?, sexAtBirth?, location?,
}

Post {
  id, author(Profile.userId), content, createdAt,
  likes[Profile], comments[Comment],
}

Comment {
  id, author(Profile.userId), post(Post.id), content, createdAt, likes[Profile],
}

Feed {
  id, name, createdAt, author(Profile.userId), users[Profile],
}
```

### Nice-to-have:

**Messages**

```
Profile.extend {
  sentMessages[Message], receivedMessages[Message],
}

Message {
  id, content,  createdAt, sender(Profile.userId), receiver(Profile.userId),
}
```

## 4. API Endpoints

|             | Method | Route                              | Description                                            | Auth Required |
| ----------- | ------ | ---------------------------------- | ------------------------------------------------------ | ------------- |
| **Auth**    |
|             | POST   | /api/auth/register                 | Create a new user                                      | X             |
|             | POST   | /api/auth/login                    | Log in                                                 | X             |
|             | GET    | /api/auth/login                    | Re-fetch user info                                     | Yes           |
|             | DELETE | /api/auth/logout                   | Delete current user session                            | Yes           |
| **Follow**  |
|             | POST   | /api/follow/:userId                | Send follow request                                    | Yes           |
|             | PATCH  | /api/follow/:userId                | Accept follow request                                  | Yes           |
|             | DELETE | /api/follow/:userId                | Cancel follow request or unfollow                      | Yes           |
|             | GET    | /api/follow/following              | Get list of current user's followed users              | Yes           |
|             | GET    | /api/follow/followers              | Get list of current user's followers                   | Yes           |
|             | GET    | /api/follow/requests               | Get list of current user's pending follow requests     | Yes           |
|             | GET    | /api/follow/notfollowing           | Get list of current user's not followed users          | Yes           |
| **Post**    |
|             | GET    | /api/posts                         | Get list of posts from current user and followed users | Yes           |
|             | POST   | /api/posts                         | Create a new post                                      | Yes           |
|             | GET    | /api/posts/:postId                 | Get a post                                             | Yes           |
|             | POST   | /api/posts/:postId/like            | Add like a post                                        | Yes           |
|             | DELETE | /api/posts/:postId/like            | Remove like on a post                                  | Yes           |
|             | POST   | /api/posts/:postId/comments        | Create a comment on a post                             | Yes           |
|             | POST   | /api/posts/:postId/:commentId/like | Add like a comment                                     | Yes           |
|             | POST   | /api/posts/:postId/:commentId/like | Remove like on a comment                               | Yes           |
| **Profile** |
|             | GET    | /api/profile                       | Get current user's profile                             | Yes           |
|             | PATCH  | /api/profile                       | Update current user's profile                          | Yes           |
|             | GET    | /api/profile/:userId               | Get specific user's profile                            | Yes           |
| **Feed**    |
|             | GET    | /api/feeds                         | Get list of current user's feeds                       | Yes           |
|             | POST   | /api/feeds                         | Create custom feed                                     | Yes           |
|             | GET    | /api/feeds/:feedId                 | Get posts from custom feed                             | Yes           |
|             | PATCH  | /api/feeds/:feedId                 | Update custom feed                                     | Yes           |
|             | DELETE | /api/feeds/:feedId                 | Delete custom feed                                     | Yes           |

## 5. Architecture & Tech Stack

- **Backend Framework**: Express
- **Database**: PostgreSQL with Prisma
- **Frontend**: React

## 6. Stretch Goals

- Deploy online
- Add tests
- Pagination
