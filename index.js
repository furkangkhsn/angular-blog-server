const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});