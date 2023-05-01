import mongoose from "mongoose"

const connectDB = (url) => {
    return mongoose.connect(url)
}

export default connectDB
// const connectionString = 'mongodb+srv://<username>:<password>@jobify.hiatb0g.mongodb.net/?retryWrites=true&w=majority'