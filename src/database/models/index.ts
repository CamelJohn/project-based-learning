import { DataTypes } from "sequelize";
import { $db } from "../instance";
import { hash as h4shP4ssw0rd, genSalt as g3nS4lt } from "bcrypt";
import JwT from "jsonwebtoken";
import {
  ArticleModel,
  ArticleTagModel,
  FollowingProfileModel,
  ProfileModel,
  TagModel,
  UserModel,
} from "./types";
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
        // if (user.getDataValue("password")) {
        const salt = await g3nS4lt(12);
        const password = await h4shP4ssw0rd(
          user.getDataValue("password"),
          salt
        );
        user.setDataValue("password", password);
        // }

        // if (user.getDataValue("token")) {
        const authToken = JwT.sign(
          { email: user.getDataValue("email") },
          token.secret,
          {
            encoding: "utf8",
            expiresIn: 1000 * 3 * 24 * 60 * 60,
          }
        );

        user.setDataValue("token", authToken);
        // }
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
});

export const FollowingProfile = $db.define<FollowingProfileModel>(
  "followingProfile",
  {
    id: {
      primaryKey: true,
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    // userId: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
    // profileUserId: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
  }
  // {
  //   indexes: [
  //     {
  //       fields: ["userId", "profileUserId"],
  //       unique: true,
  //     },
  //   ],
  // }
);

export const Article = $db.define<ArticleModel>(
  "article",
  {
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
    // authorId: {
    //   allowNull: true,
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
  },
  {
    hooks: {
      beforeValidate: async (article, options) => {
        const title = article.getDataValue("title");
        const slug = title.replace(/\s/gi, "-").toLowerCase();
        article.setDataValue("slug", slug);
      },
    },
  }
);

export const FavoriteArticle = $db.define("favoriteArticle", {
  id: {
    primaryKey: true,
    allowNull: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  // userId: {
  //   allowNull: true,
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   references: {
  //     model: User,
  //     key: "id",
  //   },
  // },
  // articleId: {
  //   allowNull: true,
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   references: {
  //     model: Article,
  //     key: "id",
  //   },
  // },
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
  // authorId: {
  //   allowNull: true,
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   references: {
  //     model: User,
  //     key: "id",
  //   },
  // },
  // articleId: {
  //   allowNull: true,
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  //   references: {
  //     model: Article,
  //     key: "id",
  //   },
  // },
});

export const Tag = $db.define<TagModel>("tag", {
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

export const ArticleTag = $db.define<ArticleTagModel>(
  "articleTag",
  {
    id: {
      primaryKey: true,
      allowNull: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    // articleId: {
    //   allowNull: true,
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   references: {
    //     model: Article,
    //     key: "id",
    //   },
    // },
    // tagId: {
    //   allowNull: true,
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   references: {
    //     model: Tag,
    //     key: "id",
    //   },
    // },
  }
  // {
  //   indexes: [
  //     {
  //       unique: true,
  //       fields: ["articleId", "tagId"],
  //     },
  //   ],
  // }
);

export function $definitions() {
  // User 1:1 => Profile
  User.hasOne(Profile, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "userId",
  });
  Profile.hasMany(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "profileId",
  });

  // User 1:n => Article
  User.hasMany(Article, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "authorId",
  });
  Article.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "authorId",
  });

  User.belongsToMany(Article, {
    through: FavoriteArticle,
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Article.belongsToMany(User, {
    through: FavoriteArticle,
    foreignKey: "articleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Tag.belongsToMany(Article, {
    through: ArticleTag,
    foreignKey: "tagId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Article.belongsToMany(Tag, {
    through: ArticleTag,
    foreignKey: "articleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.belongsToMany(User, {
    through: FollowingProfile,
    as: "following",
    foreignKey: "followerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  User.belongsToMany(User, {
    through: FollowingProfile,
    as: "followed",
    foreignKey: "followedId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  User.hasMany(Comment, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "commentId",
  });
  Comment.belongsTo(User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "authorId",
  });

  Article.hasMany(Comment, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "articleId",
  });
  Comment.belongsTo(Article, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "commentId",
  });
}
