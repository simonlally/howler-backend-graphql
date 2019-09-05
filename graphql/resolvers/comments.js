const Post = require("../../models/Post");
const { UserInputError, AuthenticationError } = require("apollo-server");
const validateAuth = require("../../util/validateAuth");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = validateAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "comment body cannot be empty"
          }
        });
      }
      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = validateAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("not allowed");
        }
      } else {
        throw new UserInputError("post not found");
      }
    }
  }
};
