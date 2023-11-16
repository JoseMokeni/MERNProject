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


// LOGIN DOESN'T WORK 
// I HAVE NO IDEA WHY
// BUT I HAVE TO FIX IT BEFORE MOVING ON


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
// @route: GET /api/users/:id
// @access: Private
const getUser = asyncHandler(async (req, res) => {
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
// @access: Private


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

module.exports = {
    registerUser,
    loginUser,
    getUser
}