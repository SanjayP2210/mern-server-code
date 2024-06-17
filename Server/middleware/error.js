const errorMiddleware = function (err, req, res, next) {
    console.log('errorMiddleware called', err);
    if (err.status) {
        res.status(err.status).json({ message: err.message });
    } else {
        res.status(500).json({
            message: err.message
        });
    }

}

export default errorMiddleware;