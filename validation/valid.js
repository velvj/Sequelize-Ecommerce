const Joi = require('joi')
const jwt = require('jsonwebtoken')
const userdatas = require('../models')

const Validate = Joi.object({
    name: Joi.string().required().min(3).error(new Error('Please enter a valid name ')),
    phone: Joi.string().required().min(10).max(10).error(new Error('Please enter a valid phone number')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password')),
    isVerified:Joi.boolean().required().error(new Error('Please enter Boolean data'))

})


const signUp = async (req, res, next) => {
    try {

        await Validate.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}

const validater = Joi.object({
    username: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,10}$')).required().error(new Error('Please enter a valid password'))
})

const login = async (req, res, next) => {
    try {
        await validater.validateAsync({ ...req.body })
        next()
    } catch (err) {
        if (err)
            err.status = await res.status(400).json({ status: 400, message: err.message || err })
        next(err)
    }
}

//update validation

const updateValidate = Joi.object({
    name: Joi.string().required().min(3).error(new Error('Please enter a valid name ')),
    phone: Joi.string().required().min(10).max(10).error(new Error('Please enter a valid phone number')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).lowercase().required().error(new Error('Please enter a valid Email ID')),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Please enter a valid password')),
    isVerified:Joi.boolean().required().error(new Error('Please enter Boolean data'))
})


const update = async (req, res, next) => {
    try {

        await updateValidate.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}



//token Auth

const tokenAuth = async (req, res, next) => {
    try {
        const token = await req.header("x-auth-token");
        if (!token) return res.status(403).json({ status: 403, message: "access denied no token provided" })
        const decoded =  jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log(decoded);
        req.man = await userdatas.user.findByPk(decoded._id);
        next();
    } catch (err) {
        if (err)
            err.status = res.status(403).json({ status: 403, message: err.message || err })
        next(err)

    }

}
//product validation

const productValidation = Joi.object({
    productName: Joi.string().required().min(3).error(new Error('please enter valid productName')),
    brand: Joi.string().required().min(3).error(new Error('please enter valid brand')),
    model: Joi.string().required().max(9999999999).error(new Error('please enter valid model name')),
    category: Joi.string().required().min(3).error(new Error('please enter valid category')),
    price: Joi.string().required().max(9999999999).error(new Error('please enter valid price ')),
    date: Joi.string().required().min(3),
    color: Joi.string().required().min(3),
    qty: Joi.string().required().error(new Error('please enter valid qty '))

})

const productValid = async (req, res, next) => {
    try {
        await productValidation.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = await res.status(400).json({ status: 400, message: err.message || err })
        next(err)

    }
}

//is ADMIN

// const isAdmin = async (req, res, next) => {
//     try {
//         if (req.man.admin === false) {
//             return next(res.status(401).send({ status: 401, message: "user not a admin" }));
//         }
//         next()
//     } catch (err) {
//         if (err)
//             err.status = res.status(403).json({ status: 403, message: err.message || err })
//         next(err)

//     }

// }


//Admin and Token

// const isAdmin = async(req, res, next) => {
//     try {
//         const token = await req.header('x-auth-token')
//         const decoded = await jwt.verify(token, process.env.TOKEN_KEY)
//         req.user = decoded
//         if (decoded.role === 'Admin') {
//             next()
//         } else {
//             res.status(400).json({ status: 400, errorMessage: `Authorization failed...!! ${decoded.name} is not Admin` })
//         }
//     } catch (err) {
//         if (err)
//             err.status = res.status(403).json({ status: 403, errorMessage: err.message || err })
//         next(err)
//     }
// }

const couponsValidation = Joi.object({
    offerName: Joi.string().required().min(3).error(new Error('please enter valid offerName')),
    couponCode: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,14}$')).required().error(new Error('Please enter a valid couponCode')),
    startDate: Joi.date().required().error(new Error('please enter valid startDate')),
    endDate: Joi.date().required().error(new Error('please enter valid endDate')),
    type: Joi.string().required().valid("discount", "amount").error(new Error('INVALID TYPE')),
    value: Joi.number().required().error(new Error('please enter valid value')),
    couponStatus: Joi.boolean()
})


const couponsValid = async (req, res, next) => {
    try {
        await couponsValidation.validateAsync({ ...req.body });
        next()
    } catch (err) {
        if (err)
            err.status = await res.status(400).send({ status: 400, message: err.message || err })
        next(err)

    }
}

// const orderValidation = Joi.object({
//     customerID: Joi.number().required().error(new Error('please enter valid customerID')),
//     productID: Joi.number().required().error(new Error('please enter valid productID')),
//     // shippingAddress: Joi.string().error(new Error('please enter valid shippingAddress')),
//     // address:Joi.string().required().error(new Error('please enter valid address')),
//     // city: Joi.string().required().error(new Error('please enter valid city')),
//     // country: Joi.string().required().min(3).error(new Error('please enter valid country ')),
//     // postalCode:Joi.number().required().error(new Error('please enter valid totalAmount')),
//     totalAmount: Joi.number().required().error(new Error('please enter valid totalAmount')),
//     couponID: Joi.number().required().error(new Error('please enter valid couponID')),
//     created: Joi.string().required().error(new Error('please enter valid qty '))

// })

// const orderValid = async (req, res, next) => {
//     try {
//         await orderValidation.validateAsync({ ...req.body });
//         next()
//     } catch (err) {
//         if (err)
//            return err.status = await res.status(400).json({ status: 400, message: err.message || err })
//         next(err)

//     }
// }





module.exports = {
    signUp, login, tokenAuth, update, productValid, couponsValid
}