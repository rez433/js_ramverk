import Article from '../models/article.js'
import Writer from '../models/writer.js'


export const resolvers = {
	Query: {
		articles: async (parent: any, args: any) => {
			return await Article.find({authorId: args.id}).populate('author').populate('co_authors').exec()
		},
		authors: async (parent: any, args: any) => {
			return await Writer.findOne({authorId: args.id})
		}
	},
	Mutation: {
		del8Doc: async (parent: any, args: any) => {
			return await Article.findByIdAndDelete({_id: args.id}, (err: Error) => {
				if (err) {
					console.log(err)
				}
				else {
					console.log('Document deleted successfully')
				}
			})
		}
	}
}
