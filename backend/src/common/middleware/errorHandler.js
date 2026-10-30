export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err)

    const status = err.status || err.statusCode || 500
    const isServerError = status >= 500
    const isProd = process.env.NODE_ENV === 'production'

    if (isServerError) console.error(err)

    res.status(status).json({
        message: isServerError && isProd ? 'Internal server error' : err.message,
        ...(!isProd && { stack: err.stack }),
    })
}