import mongoose from 'mongoose'

// const stockComment = mongoose.Schema(
//   {
//     postText: { type: String, required: true },
//     author: { type: String, required: true },
//     userID: { type: String, required: true },
//   },
//   { timestamps: true }
// )

const tickerSchema = mongoose.Schema(
  {
    ticker: { type: String, required: true, unique: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    //   comments: [
    //     {
    //       type: stockComment,
    //       required: true,
    //       default: [],
    //     },
    //   ],
  },
  { timestamps: true }
)

tickerSchema.methods = {}

export default mongoose.model('Stock', tickerSchema)
