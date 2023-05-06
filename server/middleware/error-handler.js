import { StatusCodes } from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("%c Line:2 🍊 err", "color:#465975", err);
    // res.status(500).json({ msg: 'there was an error' })    

    // tanana error(gi catch ang error) from the controller diri ma pasa
    // res.status(500).json({ msg: err })

    const defaultError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try again later',
    }

    if(err.name === 'ValidationError'){  
        // depending sa schema here we have an error in the 'email' sa postman example 
        // "email": { 
        //     "name": "ValidatorError", 
        //     "message": "Please provide email", 

        // if has err.name === 'ValidationError' change ang status code 
        defaultError.statusCode = StatusCodes.BAD_REQUEST 

        // if has err.name === 'ValidationError' change ang error message 
        // defaultError.msg = err.message 

        // if has err.name === 'ValidationError' and has multiple errors change and join ang mga error message into one error message  
        // example: if ang 'name' and 'email' both has err.name === 'ValidationError' then map ang errors then join ang 'name' and 'email' error messages 
        defaultError.msg = Object.values(err.errors).map((item) => item.message).join(',')
        // console.log("%c Line:24 🍌 defaultError.msg", "color:#6ec1c2", defaultError.msg); 
    }

    // if ang email(depends sa schema) kulang '@' or '@gmail.com'(email has to be unique) then show error message 
    if(err.code && err.code === 11000){ 
        defaultError.statusCode = StatusCodes.BAD_REQUEST 
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique` 
    }

    // show only ang error message 
    res.status(defaultError.statusCode).json({ msg: defaultError.msg }) 
    // show error message object 
    // res.status(defaultError.statusCode).json({ msg: err }) 
}

export default errorHandlerMiddleware