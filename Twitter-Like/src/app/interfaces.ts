export interface TweetInterface {
  _id: String,
  message: String,
  ownerId: String,
  theRetweet: String,
  like: number,
  retweet: number,
  isLiked: Boolean
  createdAt: Date
}

export interface UserInterface {
  _id: String,
  name: String,
  followers: Number,
  following: Number,
  isFollowed: Boolean
}
