import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("%c Line:2 🍊 err", "color:#465975", err);
    // res.status(500).json({ msg: 'there was an error' })    

    // tanana error(gi catch ang error) from the controller diri ma pasa
    // res.status(500).json({ msg: err })

    const defaultError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: 'Something went wrong, please try again later',
    }
    res.status(defaultError.statusCode).json({ msg: err })
}

export default errorHandlerMiddleware