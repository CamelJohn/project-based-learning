export interface GetFollowingArguments {
  userId: string;
  profileUserId: string;
}

export interface Contract {
  profile: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  }
}