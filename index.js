const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => ({ req })
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    return server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })
  .then(res => {
    console.log(`Server running on ${res.url}`);
  })
  .catch(err => {
    console.log(err);
  });
