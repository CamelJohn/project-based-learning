import { Model } from "sequelize";

export interface ProfileModelAttributes {
  id: string;
  username: string;
  bio: string | null;
  image: string | null;
  createdAt?: Date | null;
  upatedAt?: Date | null;
  userId: string;
}

interface ProfileCreationAttributes {
  username: string;
}

export type ProfileModel = Model<
  ProfileModelAttributes,
  ProfileCreationAttributes
>;

export interface UserModelAttributes {
  id: string;
  email: string;
  password: string;
  token: string;
  createdAt?: Date | null;
  upatedAt?: Date | null;
  profile?: ProfileModelAttributes;
}

interface UserCreationAttributes {
  email: string;
  password: string;
  profile: ProfileCreationAttributes;
}

export type UserModel = Model<UserModelAttributes, UserCreationAttributes>;

export interface FollowingModelAttributes {
  id: string;
  userId: string;
  profileUserId: string;
}

interface FollowingCreationAttributes {
  userId: string;
  profileUserId: string;
}

export type FollowingProfileModel = Model<
  FollowingModelAttributes,
  FollowingCreationAttributes
>;

export interface ArticleModelAttributes {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  favorited: boolean;
  favoritesCount: number;
  authorId: string;
}

interface ArticleCreationAttributes {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export type ArticleModel = Model<ArticleModelAttributes, ArticleCreationAttributes>;