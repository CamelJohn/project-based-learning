import { Model } from "sequelize";

export interface ProfileModelAttributes {
  id: string;
  username: string;
  bio: string | null;
  image: string | null;
  createdAt?: Date | null;
  upatedAt?: Date | null;
  userId?: string;
}

export interface ProfileCreationAttributes {
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

export interface UserCreationAttributes {
  email: string;
  password: string;
  profile: ProfileCreationAttributes;
}

export type UserModel = Model<UserModelAttributes, UserCreationAttributes>;

export interface FollowingModelAttributes {
  id: string;
  // userId: string;
  // profileUserId: string;
  followerId?: string;
  followedId?: string;
}

export interface FollowingCreationAttributes {
  followerId: string;
  followedId: string;
  // userId: string;
  // profileUserId: string;
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
  // authorId: string;
  user?: UserModelAttributes;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface ArticleCreationAttributes {
  title: string;
  description: string;
  body: string;
  // authorId: string;
  tagList?: string[];
}

export type ArticleModel = Model<
  ArticleModelAttributes,
  ArticleCreationAttributes
>;

export interface TagModelAttributes {
  id: string;
  name: string;
}

export interface TagCreationAttributes {
  name: string;
}

export type TagModel = Model<TagModelAttributes, TagCreationAttributes>;
