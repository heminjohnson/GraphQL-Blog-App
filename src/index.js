import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Type Definitions (schema)
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean 
  }
`

// Resolvers
const resolvers = {
  Query: {
    title() {
      return 'test'
    },
    price() {
      return 21
    },
    releaseYear() {
      return null
    },
    rating() {
      return 2.1
    },
    inStock() {
      return true
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
