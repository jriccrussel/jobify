const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("%c Line:2 🍊 err", "color:#465975", err);
    res.status(500).json({ msg: 'there was an error' })
}

export default errorHandlerMiddleware