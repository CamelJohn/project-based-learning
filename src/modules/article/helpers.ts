import {
  ArticleModelAttributes,
  ProfileModelAttributes,
} from "../../database/models/types";

// TODO: taglist creation
// TODO: get following
// TODO: get favorited
export function articleDomainToContract(
  article: ArticleModelAttributes,
  profile: ProfileModelAttributes,
  tagList: string[]
) {
  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: article.favorited,
      favoritesCount: article.favoritesCount,
      author: {
        username: profile.username,
        bio: profile.bio,
        image: profile.image,
        following: false,
      },
    },
  };
}

export function articlesDomainToContract(
  article: ArticleModelAttributes,
  profile: ProfileModelAttributes
) {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: [],
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: article.favorited,
    favoritesCount: article.favoritesCount,
    author: {
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
      following: false,
    },
  };
}
