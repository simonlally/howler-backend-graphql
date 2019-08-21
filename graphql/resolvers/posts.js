const Post = require("../../models/Post");
const validateAuth = require("../../util/validateAuth");

const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId).sort({ createdAt: -1 });
        if (post) {
          return post;
        } else {
          throw new Error("post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = validateAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();
      return post;
    },

    async deletePost(_, { postId }, context) {
      const user = validateAuth(context);
      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Not allowed");
        }
      } catch (err) {
        throw new AuthenticationError(err);
      }
    },

    async likePost(_, { postId }, context) {
      const { username } = validateAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find(like => like.username === username)) {
          //post is already liked so unlike it
          post.likes = post.likes.filter(like => like.username !== username);
          await post.save();
        } else {
          // not liked yet, so like it
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("post not found");
      }
    }
  }
};
