const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc: Register a new user
// @route: POST /api/users
// @access: Public
const registerUser = asyncHandler(async (req, res) => {
    let {
        name,
        phone,
        email,
        password,
    } = req.body

    let role = 'user'

    if (req.body.superSecretKey && req.body.superSecretKey === process.env.SUPER_SECRET_KEY) {
        role = 'admin'
    }
    
    console.log("Passed data catching");

    if (!name || !phone || !email || !password) {
        res.status(400)
        throw new Error('Please fill all the fields')
    }

    // if (role !== 'user'){
    //     res.status(400)
    //     throw new Error('You cannot register as a non-user')
    // }

    // encrypt the password
    const salt = await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt)
    
    
    // check email and phone existence
    const userExists = await User.findOne({
        $or: [{
            email
        }, {
            phone
        }]
    })

    console.log("User exists check");

    if (userExists) {
        res.status(400)
        throw new Error('Email or phone already exists')
    }

    // create the user
    const user = await User.create({
        name,
        phone,
        email,
        password,
        role
    })

    // check if the user was created
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


// @desc: Auth user & get token
// @route: POST /api/users/login
// @access: Public
const loginUser = asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body

    if (!email || !password) {
        res.status(400)
        throw new Error('Please fill all the fields')
    }

    // check if the user exists
    const user = await User.findOne({
        email
    })

    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }

    // check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        res.status(401)
        throw new Error('Invalid credentials')
    }

    // send the response
    res.status(200)
    res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        token: generateToken(user)
    })
})

// @desc: Get user profile
// @route: GET /api/users/me/:id
// @access: Private
const getUser = asyncHandler(async (req, res) => {
    if (tokenSended(req)){
        res.status(401)
        throw new Error('Invalid token')
    }
    // get the id from the incoming request
    const id = req.query.id
    // console.log(req.query.id);

    const user = await User.findById(id)
    // console.log('User found');
    // console.log(user);
    const token = req.headers.authorization.split(' ')[1]
    

    if (user) {
        // decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(decoded)
        
        // check token validity
        if (!decoded) {
            res.status(401)
            throw new Error('Invalid token')
        }

        // check if the user id matches the token id
        if (decoded._id != user._id && decoded.role !== 'admin') {
            res.status(401)
            throw new Error('Invalid token')
        }

        res.status(200)
        res.json({
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc: Get all users
// @route: GET /api/users
// @access: Private and only available to admins

const getUsers = asyncHandler(async (req, res) => {
    if (tokenSended(req)){
        res.status(401)
        throw new Error('Invalid token')
    }
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
        res.status(401)
        throw new Error('Invalid token')
    }

    if (decoded.role !== 'admin') {
        res.status(401)
        throw new Error('Invalid token')
    }

    const users = await User.find({})

    if (users) {
        res.status(200)
        res.json(users)
    } else {
        res.status(404)
        throw new Error('Users not found')
    }
})

// @desc: Delete a user
// @route: DELETE /api/users/:id
// @access: Private

const deleteUser = asyncHandler(async (req, res) => {
    if (tokenSended(req)){
        res.status(401)
        throw new Error('Invalid token')
    }
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // console.log("Decoded")
    // console.log(decoded)


    const id = req.query.id
    // console.log(id)

    if (!decoded) {
        res.status(401)
        throw new Error('Invalid token')
    }

    if (decoded.role !== 'admin' && decoded._id !== req.params.id) {
        res.status(401)
        throw new Error('Invalid token')
    }

    const deletedUser = await User.findByIdAndDelete(id)

    // console.log(deletedUser)

    if (deletedUser) {
        res.status(200)
        res.json({
            message: 'User deleted successfully'
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }

})

// @desc: Update a user
// @route: PUT /api/users/:id
// @access: Private

const updateUser = asyncHandler(async (req, res) => {
    if (tokenSended(req)){
        res.status(401)
        throw new Error('Invalid token')
    }
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const id = req.query.id

    console.log("Decoded")
    console.log(decoded)

    if (!decoded) {
        res.status(401)
        throw new Error('Invalid token')
    }

    // check if the user id matches the token id
    if (decoded._id != id && decoded.role !== 'admin') {
        res.status(401)
        throw new Error('Invalid token')
    }

    const user = await User.findById(id)

    if (user) {
        user.name = req.body.name || user.name
        user.phone = req.body.phone || user.phone
        user.email = req.body.email || user.email

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
        }

        const updatedUser = await user.save()

        res.status(200)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            phone: updatedUser.phone,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }

})


// token generator
const generateToken = (user) => {
    return jwt.sign({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

const tokenSended = (req) => {
    // verify if the token is present in the headers
    const authorization = req.headers.authorization
    if (!authorization) {
        return false
    } 

    return true
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser
}