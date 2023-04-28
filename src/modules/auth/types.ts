export interface UserDomain {
  id: string;
  email: string;
  token: string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  profile?: ProfileDomain
}

export interface ProfileDomain {
  username: string;
  bio: string | null;
  image: string | null;
  userId: string;
}

export interface Contract {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
}
