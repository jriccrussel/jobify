import express from 'express';
const app = express();

import dotenv from 'dotenv'
dotenv.config()

import connectDB from './db/connect.js';
// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.get('/', (req, res) => {
    // throw new Error('Error!!!')
    res.send('Welcome!')
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

// app.listen(port, () => console.log(`Server listening on ${port}...`))

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server listening on ${port}...`))
    } catch(err){
        console.log("%c Line:29 🍕 err", "color:#e41a6a", err);
    }
}

start()