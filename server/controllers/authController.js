import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'

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
//         const user = await User.create(req.body);
//         console.log("%c Line:6 🥖 user", "color:#b03734", user);
//         res.status(201).json({ user });
//     } catch (err) {
//         // res.status(500).json({ msg: 'There wast an error' });
//         // errors ma pasa didto erro-handler middleware
//         next(err)
//     }
// }

const register = async (req, res) => {

    const { name, email, password } = req.body

    if(!email || !password || !name) {
        // throw new CustomAPIError('Please provide all values')
        throw new BadRequestError('Please provide all values')
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
        throw new BadRequestError('Email already in use')
    }

    const user = await User.create({ name, email, password });

    // add token
    const token = user.createJWT()
    
    res.status(StatusCodes.OK).json({ 
        user: {
            email: user.email,
            lastName: user.lastName,
            location: user.location,
            name: user.name
        }, 
        token, 
        location: user.location 
    });
}

const login = async (req, res) => {
    res.send('login user')
}

const updateUser = async (req, res) => {
    res.send('update user')
}

export{ register, login, updateUser }