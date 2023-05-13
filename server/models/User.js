import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        select: false,
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 20,
        default: 'lastName',
    },
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: 'my city',
    },
})

// mongoose middleware - a way for us to do something before and after we save or do functionalities(like to hash a password)
UserSchema.pre('save', async function(){
    // console.log(this.password)
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// kini cya what it does it will create a token
// token is uniquely to that user so every time ang user register or login the token will send to server then signs the JWT using a secret key that only the server knows. The JWT is then sent to the client, which stores it in local storage or a cookie.
UserSchema.methods.createJWT = function(){
    // console.log(this)
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
}

export default mongoose.model('User', UserSchema)