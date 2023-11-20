const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const protect = asyncHandler(async (req, res, next) => {
    let token

    // check if the token is sent and starts with Bearer
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get the token
            token = req.headers.authorization.split(' ')[1]

            // decode the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get the user from the database
            req.user = await User.findById(decoded._id).select('-password')

            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    // check if the token exists
    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = protect
