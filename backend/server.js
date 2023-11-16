const express =require('express')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middlewares/errorMiddleware')
const PORT = process.env.PORT || 3001
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// mongoose connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected')
}).catch((err) => {
    console.log(err)
})


app.use('/api/users', require('./routes/userRoutes'))


app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})