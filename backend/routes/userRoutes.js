const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUser, getUsers, deleteUser, updateUser } = require('../controllers/userController')

router.post('/', registerUser)

router.get('/', getUsers)

router.post('/login', loginUser)

// get user profile
router.get('/me', getUser)

router.delete('/', deleteUser)


router.put('/', updateUser)

module.exports = router