import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Type Definitions (schema)
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float  
  }
`

// Resolvers
const resolvers = {
  Query: {
    id() {
      return 'abc123'
    },
    name() {
      return 'Hemin'
    },
    age() {
      return 26
    },
    employed() {
      return true
    },
    gpa() {
      return null
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
