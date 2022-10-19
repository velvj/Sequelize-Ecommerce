const db = require('../models')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const userData = db.user;
const { Op } = require("sequelize");
const nodemailer = require('nodemailer');
const { google } = require('googleapis')
require("dotenv").config()

//create node mailer

const userMail = async (name, email, password) => {

    try {
        // const CLIENT_ID = '160245785177-mfh70ult1tcs7r7npbhlhr90jedvvmdp.apps.googleusercontent.com'
        // const CLIENT_SECRET = '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'
        // const REFRESH_TOKEN = '1//040-vAM4ETSveCgYIARAAGAQSNwF-L9Irkp9rOkG93Bf36rTtZGpJNZA2M7bR0m4m_7fZuYWLlJyY2M61QNRIhd-usV9JLblX8Dw'
        // const REDIRECT_URI = 'https://developers.google.com/oauthplayground
        const CLIENT_ID = process.env.CLIENT_ID
        const CLIENT_SECRET = process.env.CLIENT_SECRET
        const REFRESH_TOKEN = process.env.REFRESH_TOKEN
        const REDIRECT_URI= process.env.REDIRECT_URI
// console.log(CLIENT_ID,"ID")
// console.log(CLIENT_SECRET,"secret")
// console.log(REDIRECT_URI,"uri")
// console.log(REFRESH_TOKEN,"token")
        const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

        const accessToken = await oAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAUTH2',
                user:process.env.EMAIL_ID,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from:process.env.EMAIL_ID,
            to: process.env.TO_ID,
            subject: 'hello this is verify email',
            // text: `hi ${name} welcome this your mailID:  ${email} uniqueData: ${password}`,
            html: '<p>You requested for email verification, kindly use this <a href="http://localhost:3000/user/verify-tokenEmail/' + password + '">link</a> to verify your email address</p>',
            context: {
                name: name,
                email: email,
                password: password
            }
        };
        // console.log(mailOptions, 'data')
        const result = transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            return console.log("Message sent: %s", info.messageId, info)
        })
        // return await console.log(result,"result")
    } catch (err) {
        return console.log("Message not sent: %s", err);

    }
}

//verfication Email

const VerifyEmail = async (req, res) => {
    try {
        const Email = req.body.email
        console.log(Email);
        const user = await userData.findOne({ where: { email: Email } })
        if (user) {
            const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN)
            userMail(user.name, user.email, token)
            res.status(200).send({ status: 200, success: true, msg: "please check inbox" })
        }
        else {
            res.status(400).send({ error: "User with this email not found" })
        }
    } catch (error) {
        res.status(400).send({ status: 400, success: false, msg: error.message })
    }
}


//after get email

const clickMail = async (req, res) => {
    try {
        const tokenData = req.params.token
        const decoded = jwt.verify(tokenData, process.env.ACCESS_TOKEN);
        if (!decoded) return res.status(403).json({ status: 403, message: "The user email id does not exists" })
        else {

            const result = await userData.update({ isVerified: true }, { where: { email: decoded.email } })
            return res.status(200).send({ status: 200, message: "email ID verified  successfully" })
        }
    } catch (err) {
        res.status(400).send({ status: 400, success: false, msg: err.message })
    }
}


//Reset Password
const resetPassword = async (req, res) => {
    try {
        const id = req.params.id

        const newUser = await userData.findOne({ where: { customerID: id } })
        const compare = await bcrypt.compare(req.body.password, newUser.password)
        if (compare) return res.status(400).send({ status: 400, message: "password is already exsits" })
        if ((req.body.password !== req.body.confirmPassword)) {
            return res.status(404).send({
                message: 'password does not match'
            })
        }
        if (!newUser) {
            return res.status(404).send({
                message: 'user not found'
            })
        }
        const passData = await bcrypt.hash(req.body.password, 10)
        const result = await userData.update({ password: passData }, { where: { customerID: newUser.customerID } })
        res.status(200).send({ status: 200, message: "password Reset  successfully", data: result })
    }
    catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//createUser

const createUser = async (req, res) => {
    try {
        let email = req.body.email
        let phone = req.body.phone
        const clientExist = await userData.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });
        if (clientExist) {

            return res.status(400).json({ status: 400, message: "User already exists" });
        }
        else {
            const salt = await bcrypt.hash(req.body.password, 10)
            const userCollection = await userData.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: salt,
                isVerified: req.body.isVerified


            })
            const savedUser = await userCollection.save()
            userMail(savedUser.name, savedUser.email, req.body.password)
            return res.status(200).send({ status: 200, message: "users created successfully", data: savedUser })


        }
    } catch (err) {
        return res.status(400).json({ status: 400, message: err.message || err });
    }
}



const getUser = async (req, res) => {
    try {
        let myData = await userData.findAll({})
        res.status(200).send({ status: 200, message: "users details viewed successfully", data: myData })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//getUser ID

const getUserId = async (req, res) => {
    try {
        const Id = req.params.id
        const findID = await userData.findOne({ where: { customerID: Id } })
        res.status(200).send({ status: 200, message: "users details viewed successfully", data: findID })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}
//findByPk
const getByPk = async (req, res) => {
    const Id = req.params.id
    console.log(Id);
    try {
        const testing = await userData.findByPk(Id);
        if (testing === null) {
            res.status(400).send({ status: 400, message: "something went wrong" || err })
        } else {
            return res.status(200).send({ status: 200, message: "users details viewed successfully", data: testing })
        }
    }
    catch (err) {
        return res.status(400).send({ status: 400, message: err })
    }

}

//updateUser

const updateUser = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        const update = await userData.update({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPass,
            isVerified: req.body.isVerified
        }, { where: { customerID: req.params.id } })
        if (update) {
            return res.status(200).send({ status: 200, message: "users details updated successfully", data: update })
        }
    } catch (err) {
        return res.status(400).send({ status: 400, message: err })
    }
}


//deleteUser

const deleteUser = async (req, res) => {
    try {
        const Id = req.params.id
        const delete_user = await userData.destroy({ where: { customerID: Id } })
        console.log("successfully");
        if (!delete_user) return await res.status(200).send({ status: 200, message: "no data there", data: delete_user })
        else return await res.status(200).send({ status: 200, message: "users deleted successfully", data: delete_user })
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}

//login user

const userLogin = async (req, res) => {
    try {
        let username = req.body.username;
        const user = await userData.findOne({ where: { email: username }, });
        if (user) {
            let password = req.body.password;
            const result = await bcrypt.compare(password, user.password)
            if (!result) {
                return res.status(200).json({ status: 200, message: 'password match' })
            }
            else {
                let token = jwt.sign({ "id": user.id }, process.env.ACCESS_TOKEN);
                const data = { "name": user.name, "email": user.email, "phone": user.phone, "token": token };

                return res.status(200).json({ status: 200, message: 'login succesfully', data: data })
            }

        }
        else return res.status(200).json({ status: 200, message: 'username doesnt match' })
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}

//delete All user
const deleteAllUser = async (req, res) => {
    try {
        const deleteAll = await userData.destroy({
            where: {},
            truncate: false
        })
        console.log(deleteAll);
        if (!deleteAll) return res.status(200).send({ status: 200, message: "no data there", data: deleteAll })
        else return res.status(200).send({ status: 200, message: "all data deleted successfully", data: deleteAll })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}




module.exports = {
    getUser, createUser, updateUser, deleteUser, userLogin, getUserId, deleteAllUser, getByPk, userMail, resetPassword, VerifyEmail, clickMail
}