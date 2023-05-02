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
  followerId?: string;
  followedId?: string;
}

export interface FollowingCreationAttributes {
  followerId: string;
  followedId: string;
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
  authorId?: string;
  user?: UserModelAttributes;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  tags?: TagModelAttributes[];
}

export interface ArticleCreationAttributes {
  title: string;
  description: string;
  body: string;
  authorId: string;
  tags?: string[];
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

export interface ArticleTagCreationAttributes {
  tagId: string;
  articleId: string;
}

export interface ArticleTagModelAttributes {
  id: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  tagId?: string;
  articleId?: string;
}

export type ArticleTagModel = Model<ArticleTagModelAttributes, ArticleTagCreationAttributes>;