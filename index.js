const express = require('express')
const app = express()
const morgan = require('morgan')
require("dotenv").config()
const db = require('./models')

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

//userRoutes
const userRoutes = require('./routes/userRoute')
app.use('/user', userRoutes)

//productRoutes
const produtRoutes = require('./routes/productRoute')
app.use('/product', produtRoutes)

//orderRoutes
const orderRoutes = require('./routes/orderRoute')
app.use('/order', orderRoutes)

//couponRoutes

const couponRoutes = require('./routes/couponRoute')
app.use('/coupon', couponRoutes)

// db.sequelize.sync({}).then(()=>{
// console.log("Database sync");
// })

app.listen(PORT, () => { console.log(`Server listening on ${PORT}`); })

