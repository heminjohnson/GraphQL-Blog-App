import { GraphQLServer } from 'graphql-yoga'

// Type Definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query'
    },
    name() {
      return 'Hemin Johnson'
    },
    location() {
      return 'Berlin'
    },
    bio() {
      return 'I am a software engineer'
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('server is up!')
})
