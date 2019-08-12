import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@example.com',
  age: 26
}, {
  id: '2',
  name: 'sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}]

let posts = [{
  id: '10',
  title: 'GraphQL 101',
  body: 'This is how to use GraphQL ...',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'GraphQL 201',
  body: 'This is an advanced GraphQl post ...',
  published: false,
  author: '1'
}, {
  id: '12',
  title: 'Programming Music',
  body: '',
  published: false,
  author: '2'
}]

let comments = [{
  id: '102',
  text: 'This works well for me. Thanks',
  author: '3',
  post: '10'
}, {
  id: '103',
  text: 'Glad you enjoyed it',
  author: '1',
  post: '10'
}, {
  id: '104',
  text: 'This did not work.',
  author: '2',
  post: '11'
}, {
  id: '105',
  text: 'Never mind. I got it to work',
  author: '1',
  post: '12'
}]

// Type Definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post
  }
  
  type Mutation {
    createUser(data: createUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: createPostInput): Post!
    createComment(data: createCommentInput): Comment!
  }
  
  input createUserInput {
    name: String!
    email: String!
    age: Int
  }
  
  input createPostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  
  input createCommentInput {
    text: String!
    author: ID!
    post: ID!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    comments(parent, args, ctx, info) {
      return comments
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com'
      }
    },
    post() {
      return {
        id: '092',
        body: 'GraphQL 101',
        title: '',
        published: false
      }
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email)

      if(emailTaken) {
        throw new Error('Email Taken')
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }

      users.push(user)

      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)

      if(userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = users.splice(userIndex, 1)

      posts = posts.filter((post) => {
        const match = post.author === args.id

        if (match) {
          comments = comments.filter((comment) => comment.post !== post.id)
        }

        return !match
      })
      comments = comments.filter((comment) => comment.author !== args.id)

      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)

      if(!userExists) {
        throw new Error('User not found')
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post)

      return post
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)
      const postExists = posts.some((post) => post.id === args.data.post && post.published)

      if(!userExists || !postExists) {
        throw new Error('Unable to find user and post')
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }

      comments.push(comment)

      return comment
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
      })
    },
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('server is up!')
})
