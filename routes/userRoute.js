const express = require('express')
const router = express.Router();
const userData = require('../controller/userController')
const validate = require('../validation/valid')


router.get('/getUser', userData.getUser)
router.post('/signUp', validate.signUp, userData.createUser)
router.put('/update/:id', validate.update, validate.tokenAuth, userData.updateUser)
router.get('/getId/:id',  userData.getUserId)
router.get('/getIdPk/:id', validate.tokenAuth, userData.getByPk)
router.delete('/delete/:id', userData.deleteUser)
router.delete('/deleteAll', validate.tokenAuth, userData.deleteAllUser)
router.post('/userLogin', validate.login, userData.userLogin)
router.post('/userMail', userData.userMail)
router.put('/resetPassword/:id', userData.resetPassword)
router.put('/VerifyEmail', userData.VerifyEmail)
router.get('/verify-tokenEmail/:token', userData.clickMail)



module.exports = router