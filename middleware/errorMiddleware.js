const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        error.message = 'Not found in database';
        error.statusCode = 404;
    }

    if (err.code === 11000) {
        error.message = 'Duplicate entry detected';
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;