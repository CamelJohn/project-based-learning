import { DataTypes } from "sequelize";
import { $db } from "../instance";
import { hash as h4shP4ssw0rd, genSalt as g3nS4lt } from "bcrypt";
import JwT from "jsonwebtoken";
import { ProfileModel, UserModel } from "./types";
import { getConfig } from "../../utils/dotenv";

const { token } = getConfig();

export const User = $db.define<UserModel>(
  "user",
  {
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
  },
  {
    hooks: {
      beforeValidate: async (user, options) => {
        const salt = await g3nS4lt(12);
        const password = await h4shP4ssw0rd(
          user.getDataValue("password"),
          salt
        );
        user.setDataValue("password", password);

        const authToken = JwT.sign(
          { email: user.getDataValue("email") },
          token.secret,
          {
            encoding: "utf8",
            expiresIn: 1000 * 3 * 24 * 60 * 60,
          }
        );

        user.setDataValue('token', authToken);
      },
    },
  }
);

export const Profile = $db.define<ProfileModel>("profile", {
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
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
  }
});

export const FollowingProfile = $db.define(
  "followingProfile",
  {
    id: {
      primaryKey: true,
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: User,
        key: "id",
      },
    },
    profileUserId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        fields: ["userId", "profileUserId"],
        unique: true,
      },
    ],
  }
);

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
  authorId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: User,
      key: "id",
    },
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
      key: "id",
    },
  },
  articleId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Article,
      key: "id",
    },
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
      key: "id",
    },
  },
  articleId: {
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: Article,
      key: "id",
    },
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
    unique: true,
  },
});

export const ArticleTag = $db.define(
  "articleTag",
  {
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
        key: "id",
      },
    },
    tagId: {
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: Tag,
        key: "id",
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["articleId", "tagId"],
      },
    ],
  }
);

export function $definitions() {
  // User 1:1 => Profile
  User.hasOne(Profile, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "userId",
  });

  // User 1:n => Article
  User.hasMany(Article, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "authorId",
  });

  // User 1:n => Article
  User.hasMany(FavoriteArticle, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "userId",
  });
  FavoriteArticle.hasMany(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "favoriteArticleId",
  });

  // Article 1:m => Tag
  ArticleTag.hasMany(Article, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "tagId",
  });
  ArticleTag.hasMany(Tag, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "articleId",
  });
}
