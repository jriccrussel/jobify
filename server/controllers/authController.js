import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError, UnAuthenticatedError } from '../errors/index.js'
import attachCookie from '../utils/attachCookies.js'

// Custom Errors
// class CustomAPIError extends Error {
//     constructor(message){
//         super(message)
//         // this.statusCode is based on the key of status code from error-handler
//         // const defaultError = {
//         //     statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//         // }
//         this.statusCode = StatusCodes.BAD_REQUEST
//     }
// }

// class BadRequestError extends CustomAPIError {
//     constructor(message){
//         super(message)
//         this.statusCode = StatusCodes.BAD_REQUEST
//     }
// }

// class NotFoundError extends CustomAPIError {
//     constructor(message){
//         super(message)
//         this.statusCode = StatusCodes.NOT_FOUND
//     }
// }

// const register = async (req, res, next) => {
//     try {
//         const user = await User.create(req.body)
//         console.log("%c Line:6 🥖 user", "color:#b03734", user)
//         res.status(201).json({ user })
//     } catch (err) {
//         // res.status(500).json({ msg: 'There wast an error' })
//         // errors ma pasa didto erro-handler middleware
//         next(err)
//     }
// }

// post - {{URL}}/auth/register
const register = async (req, res) => {

    const { name, email, password } = req.body

    if(!email || !password || !name) {
        // throw new CustomAPIError('Please provide all values')
        throw new BadRequestError('Please provide all values')
    }

    const userAlreadyExists = await User.findOne({ email })

    if (userAlreadyExists) {
        throw new BadRequestError('Email already in use')
    }

    const user = await User.create({ name, email, password })
    // console.log("%c Line:59 🧀 user", "color:#6ec1c2", user)

    // add token
    const token = user.createJWT()

    // store ang token sa cookie dili sa local storage
    attachCookie({ res, token })
    
    // res.status(StatusCodes.CREATED).json({ 
    //     user: {
    //         email: user.email,
    //         lastName: user.lastName,
    //         location: user.location,
    //         name: user.name
    //     }, 
    //     token, 
    //     location: user.location 
    // })
    res.status(StatusCodes.CREATED).json({ 
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name
        },  
        location: user.location 
    })
}

// post - {{URL}}/auth/login
const login = async (req, res) => {
    // res.send('login user')
    const { email, password } = req.body

    if(!email || !password) {
        throw new BadRequestError('Please provide all values')
    }
    // sa console ddto naa error 'string, undefined' and tan-aw nato sa ato terminal sulod sa 'user' object wla na apil ang password and sa model sa ato user Schema ato password na set to "password: { ..., select: false, }," mao wla na apil ang password 
    // const user = await User.findOne({ email })
    // para ma apil ang password add ta .select('+password') para ma apil ang password(sa server ra nato makita ug ma apil and dili ma apil ug dili makita sa client) and also It prevents showing password from the user instance in the response body by default. Therefore, you aren't exposing it to the client(which means dili makita sa ato client) when you have your entire user object(which would contain the password stored in the mongo db), token, and location.
    const user = await User.findOne({ email }).select('+password')
    // console.log("%c Line:59 🍑 user", "color:#ea7e5c", user)

    if(!user) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()

    // remove nato from our response(ato g send)
    // to avoid sending sensitive data like password sa ato client
    user.password = undefined

    // store ang token sa cookie dili sa local storage
    attachCookie({ res, token })

    // instead e store ang token sa local storage we instead store it sa ato cookie
    // we store ang token to cookie when everytime mag login/register ta and e authenticate pud nya at the same time ddto sa server(sa middleware check if sakto ang token or dili)
    // const oneDay = 1000 * 60 * 60 * 24
    // res.cookie('token', token, {
    //     httpOnly: true,
    //     expires: new Date(Date.now() + oneDay),
    //     secure: process.env.NODE_ENV === 'production',
    // })
    // res.send('login user')
    // res.status(StatusCodes.OK).json({ user, token, location: user.location })
    res.status(StatusCodes.OK).json({ user, location: user.location })
}

// patch - {{URL}}/auth/updateUser
const updateUser = async (req, res) => {
    // console.log("%c Line:109 🍔 req.user", "color:#4fff4B", req.user)
    // res.send('update user')
    const { email, name, lastName, location } = req.body
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values')
    }

    const user = await User.findOne({ _id: req.user.userId })

    // assign nato each corresponding keys and values
    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()

    // various setups
    // in this case only id
    // if other properties included, must re-generate

    const token = user.createJWT()

    // store ang token sa cookie dili sa local storage
    attachCookie({ res, token })

    //res.status(StatusCodes.OK).json({
    //    user,
    //    token,
    //    location: user.location,
    //})
    res.status(StatusCodes.OK).json({
        user,
        location: user.location,
    })
}

// get - {{URL}}/getCurrentUser
const getCurrentUser = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId })
    res.status(StatusCodes.OK).json({ user, location: user.location })
}

// get - {{URL}}/logout
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    })
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' })
}

export{ register, login, updateUser, getCurrentUser, logout }