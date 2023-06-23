import jwt from 'jsonwebtoken'
import { UnAuthenticatedError } from '../errors/index.js'

const auth = async (req, res, next) => {
    // check if naa cookie sa every request nato(like login, register, check sa all jobs, update/edit sa jobs)
    console.log("%c Line:5 🎂 req.cookies", "color:#6ec1c2", req.cookies);
    // console.log("%c Line:2 🍿", "color:#93c0a4", "authenticate user")
    // const headers = req.headers
    // const authHeader = req.headers.authorization
    // console.log(headers)
    // console.log(authHeader)

    // if (!authHeader) {
    //     // why, well is it 400 or 404?
    //     // actually 401
    //     throw new UnAuthenticatedError('Authentication Invalid')
    // }

    // check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnAuthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
  
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // why need nato ang `{ userId: ... }`?
        // Remember `jwt.sign` specifically ang `{ userId: this._id }`(didto sa UserSchema.methods.createJWT from User model) since part man ang `{ userId: ... }` sa ato `custom claims` meaning naa tay always access sa `{ userId: ... }` kai part man cya as payload sa `jwt`

        // then `jwt.verify` access and retrieve nato ang `custom claims` ang `{ userId: ... }`(ang sulod sa payload sa `jwt`) para e verify nato and if ang verification kai successful then return ang payload(meaning naa tay access sa `claims` like `{ userId: ... }` and etc)

        // !!!IMPORTANT!! you can include the userId as a property in the token's payload when calling the sign method, and then verify the token later to access the userId from the decoded payload.

        // console.log("%c Line:27 🍌 jwt", "color:#e41a6a", jwt)
        // console.log("%c Line:25 🍐 payload", "color:#e41a6a", payload)

        // attach the user request object
        // req.user will now have access sa payload(sulod sa payload naa dre ang `{ userId: ... }`)
        // req.user = payload
        // console.log("%c Line:33 🎂 payload.userId", "color:#3f7cff", payload.userId)
        // console.log("%c Line:39 🍪 req.user", "color:#465975", req.user)

        // req.user will now have access sa `{ userId: ... }`(or ang payload)
        // req.user = { userId: payload.userId }
        
        const testUser = payload.userId === '649562d8955f87896b4dddab'
        // const testUser = payload.userId === 'testUserID'
        req.user = { userId: payload.userId, testUser }
        // console.log("%c Line:5 🍓 req.user", "color:#e41a6a", req.user);

        next()
    } catch (error) {
        throw new UnAuthenticatedError('Authentication invalid')
    }
}

export default auth