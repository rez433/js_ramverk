import { gql } from 'graphql-tag'

const typeDefs = gql`
  # GraphQL schema definition
	scalar JSON
  type Author {
    _id: ID!
    name: String
    lastName: String
    email: String
    password_hash: String!
    role: String
    Articles: [Article]
  }

	scalar Date

  type Article {
		_id: ID!
		title: String
		content: JSON
		author: Author!
		co_authors: [Author!]
		createdAt: Date
		updatedAt: Date
		version: Int
  }

  type Query {
    articles(authorId: ID!): [Article!]!
		authors(authorId: ID!): Author!
  }

	type Mutation {
		cr8User(name: String!, lastName: String!, email: String!, password: String!, role: String!): Author
		upd8User(_id: ID!, name: String, lastName: String, email: String, 		password: String, role: String): Author
		del8User(_id: ID!): Author
		del8Doc(_id: ID!): Article
	}
`

export default typeDefs
