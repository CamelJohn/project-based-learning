// export interface UserDomain {
//   id: string;
//   email: string;
//   token: string;
//   password: string;
//   createdAt?: Date | null;
//   updatedAt?: Date | null;
//   deletedAt?: Date | null;
//   profile?: ProfileDomain
// }

// export interface ProfileDomain {
//   id: string;
//   username: string;
//   bio: string | null;
//   image: string | null;
//   userId: string;
//   createdAt?: Date | null;
//   updatedAt?: Date | null;
//   deletedAt?: Date | null;
// }

export interface Contract {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
}
