// @desc: Register a new user
// @route: POST /api/users
// @access: Public
const registerUser = (req, res) => {
    const {
        name,
        phone,
        email,
        password
    } = req.body

    if (!name || !phone || !email || !password) {
        res.status(400)
        throw new Error('Please fill all the fields')
    }

    res.send('Register route')
}

// @desc: Auth user & get token
// @route: POST /api/users/login
// @access: Public
const loginUser = (req, res) => {
    res.send('Login route')
}

module.exports = {
    registerUser,
    loginUser
}