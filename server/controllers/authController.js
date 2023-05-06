import User from '../models/User.js';

const register = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        console.log("%c Line:6 🥖 user", "color:#b03734", user);
        res.status(201).json({ user });
    } catch (err) {
        // res.status(500).json({ msg: 'There wast an error' });
        next(err)
    }
}

const login = async (req, res) => {
    res.send('login user')
}

const updateUser = async (req, res) => {
    res.send('update user')
}

export{ register, login, updateUser }