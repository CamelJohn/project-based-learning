import { Model } from "sequelize";

export interface ProfileModelAttributes {
  id?: string;
  username: string;
  bio: string | null;
  image: string | null;
  createdAt?: Date | null;
  upatedAt?: Date | null;
  deletedAt?: Date | null;
  userId: string;
}

interface ProfileCreationAttributes {
  username: string;
}

export type ProfileModel = Model<ProfileModelAttributes, ProfileCreationAttributes>;

export interface UserModelAttributes {
  id: string;
  email: string;
  password: string;
  token: string;
  createdAt?: Date | null;
  upatedAt?: Date | null;
  deletedAt?: Date | null;
  profile?: ProfileModelAttributes;
}

interface UserCreationAttributes {
  email: string;
  password: string;
  profile: ProfileCreationAttributes;
}

export type UserModel = Model<UserModelAttributes, UserCreationAttributes>;
