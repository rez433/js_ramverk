import Article from '../models/article.js'
import Writer from '../models/writer.js'
import Comment from '../models/comment.js'

export const resolvers = {
	Query: {
		articles: async (parent: any, args: any) => {
			return await Article.find({authorId: args.id}).populate('author').populate('co_authors').populate({path: 'comments', populate: {path: 'commenter'}}).exec()
		},
		author: async (parent: any, args: any) => {
			return await Writer.findOne({authorId: args.id})
		},
		article_comments: async (parent: any, args: any) => {
			return await Comment.find({articleId: args.id}).populate('commenter').exec()
		},
		article: async (parent: any, args: any) => {
			return await Article.findById(args.articleId).populate('author').populate('co_authors').populate({path: 'comments', populate: {path: 'commenter'}}).exec()
		}
	},
	Mutation: {
		del8Doc: async (parent: any, args: any) => {
			return await Article.findByIdAndDelete({authorId: args.id}, (err: Error) => {
				if (err) {
					console.log(err)
				}
				else {
					console.log('Document deleted successfully')
				}
			})
		},
		cr8Cmnt: async (parent: any, args: any) => {
      const comment = new Comment({
        content: args.content,
        commenter: args.commenter,
        article: args.article,
        range: args.range,
      });
      const cmnt = await comment.save();

      await Article.findByIdAndUpdate(args.article, { $push: { comments: cmnt._id } });

      return cmnt;
    },
	}
}
