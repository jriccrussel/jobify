import cors from 'cors'
import express from 'express'
const app = express()

import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

// para sa security
import helmet from 'helmet'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

// db
import connectDB from './db/connect.js'

// authenticate

// router
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'

// middleware
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authenticateUser from './middleware/auth.js'

// cookieParser - we can able to parse or can use cookies in every request nato coming from our controiller 
import cookieParser from 'cookie-parser'

// http logger middleware as we setup more routes and controllers is used to see what routes, methods and status codes and be shown sa terminal
if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'))
}

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, '../client/build')))

app.use(cors())
app.use(express.json())
app.use(cookieParser())

// para sa security
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.get('/', (req, res) => {
    // throw new Error('Error!!!')
    // res.send('Welcome!')
    res.json({ msg: 'Welcome!' })
})

// app.get('/api/v1', (req, res) => {
//     res.json({ msg: 'API' })
// })

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
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
        console.log("%c Line:29 🍕 err", "color:#e41a6a", err)
    }
}

start()