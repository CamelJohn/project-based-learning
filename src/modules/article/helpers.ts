import {
  ArticleModelAttributes,
  ProfileModelAttributes,
} from "../../database/models/types";

// TODO: taglist creation
// TODO: get following
// TODO: get favorited
export function articleDomainToContract(
  article: ArticleModelAttributes,
  tags: string[] = [],
  profile?: ProfileModelAttributes,
) {
  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tags,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: article.favorited,
      favoritesCount: article.favoritesCount,
      author: {
        username: profile?.username ?? article.user?.profile?.username ?? null,
        bio: profile?.bio ?? article.user?.profile?.bio ?? null,
        image: profile?.image ?? article.user?.profile?.image ?? null,
        following: false,
      },
    },
  };
}

export function articlesDomainToContract(article: ArticleModelAttributes) {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tags?.map(t => t.name) || [],
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: article.favorited,
    favoritesCount: article.favoritesCount,
    author: {
      username: article.user?.profile?.username,
      bio: article.user?.profile?.bio,
      image: article.user?.profile?.image,
      following: false,
    },
  };
}
