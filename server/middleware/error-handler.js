const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("%c Line:2 🍊 err", "color:#465975", err);
    // res.status(500).json({ msg: 'there was an error' })    
    res.status(500).json({ msg: err })
}

export default errorHandlerMiddleware