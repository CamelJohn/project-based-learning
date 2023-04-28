import { DataTypes } from "sequelize";
import { $db } from "../instance";

export const User = $db.define("user", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Profile = $db.define("profile", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

export const FollowingProfile = $db.define("followingProfile", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: User,
      key: "id",
    },
  },
  profileId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Profile,
      key: "id",
    },
  },
});

export const Article = $db.define("article", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorited: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  favoritesCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

export const FavoriteArticle = $db.define("favoriteArticle", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: User,
      key: 'id'
    }
  },
  articleId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Article,
      key: 'id'
    }
  },
});

export const Comment = $db.define("comment", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  body: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  authorId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: User,
      key: 'id'
    }
  },
  articleId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Article,
      key: 'id'
    }
  },
});

export const Tag = $db.define("tag", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const ArticleTag = $db.define('articleTag', {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  articleId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Article,
      key: 'id'
    }
  },
  tagId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Tag,
      key: 'id'
    }
  },
})