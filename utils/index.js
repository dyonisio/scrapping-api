const sendError = (req, error) => {
    switch(error.name){
        case 'TimeoutError':
            return {
                urlRequest: req.originalUrl,
                statusCode: 404,
                name: error.name,
                message: error.message
            }
        break

        case 'RouteNotFound':   
            return {
                urlRequest: req.originalUrl,
                statusCode: 404,
                name: error.name,
                message: error.message
            }
        break

        case 'MissingParameter':
            return {
                urlRequest: req.originalUrl,
                statusCode: 400,
                name: error.name,
                message: error.message
            }
        break

        default:
            return {
                urlRequest: req.originalUrl,
                statusCode: 500,
                name: error.name,
                message: error.message
            }
        break
    }
}

module.exports = {
    sendError
}