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

export interface UserInterfaceMin {
  _id: String,
  name: String
}

export interface UserInterfaceFull {
  _id: String,
  name: String,
  following: Array<String>,
  followers: Array<String>
}
