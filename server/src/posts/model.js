import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
  {
    ticker: { type: String, required: true },
    postText: { type: String, required: true },
    author: { type: String, required: true },
    userID: { type: String, required: true },
    postLikes: {
      type: Number,
      min: 0,
      max: 4294967296,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
)

postSchema.methods = {}

export default mongoose.model('Post', postSchema)
