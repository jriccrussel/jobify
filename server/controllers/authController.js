import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes'

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
    const user = await User.create(req.body);
    console.log("%c Line:6 🥖 user", "color:#b03734", user);
    res.status(StatusCodes.OK).json({ user });
}

const login = async (req, res) => {
    res.send('login user')
}

const updateUser = async (req, res) => {
    res.send('update user')
}

export{ register, login, updateUser }