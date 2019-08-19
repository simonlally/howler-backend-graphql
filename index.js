const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");
const mongoose = require("mongoose");

const Post = require("./models/Post");
const { MONGODB } = require("./config.js");

const typeDefs = gql`
  type Query {
    sendGreeting: String!
  }
`;

const resolvers = {
  Query: {
    sendGreeting: () => "Hello World!"
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected!");
    return server.listen({ port: 5000 });
  })
  .then(res => {
    console.log(`Server running on ${res.url}`);
  })
  .catch(err => {
    console.log(err);
  });
