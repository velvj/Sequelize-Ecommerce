const couponsData = require('../models');
const coupons = couponsData.coupon;
const { Op } = require("sequelize");


//create coupon

const createCoupon = async (req, res) => {
    try {
        const couponlist = {
            offerName: req.body.offerName,
            couponCode: req.body.couponCode,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            type: req.body.type,
            value: req.body.value,
            couponStatus: req.body.couponStatus
        }
        const couponData = await coupons.create(couponlist);
        return res.status(200).send({ status: 200, message: "coupon created successfully", data: couponData })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY' && err.code == 1060) {
            return res.status(400).json({ status: 400, message: "Product Already exits" });
        }
        return res.status(400).json({ status: 400, message: err.message || err });
    }
}


//getcoupon

const getCoupons = async (req, res) => {
    try {
        const Id = req.params.id
        const getCoupon = await coupons.findOne({couponID:Id})
        res.status(200).send({ status: 200, message: "coupon details viewed successfully", data: getCoupon })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//update coupon

const updateCoupon = async (req, res) => {
    try {
        const updatecoupon = await coupons.update({
            offerName: req.body.offerName,
            couponCode: req.body.couponCode,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            type: req.body.type,
            value: req.body.value,
            couponStatus: req.body.couponStatus
        }, { where: { couponID: req.params.id } })
        if (updatecoupon) {
            return res.status(200).send({ status: 200, message: "coupon details updated successfully", data: updatecoupon })
        }
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}

//delete Coupon

const deletetCoupon = async (req, res) => {
    try {
        const delete_coupon = await coupons.destroy({ where: { couponID: req.params.id } })
        console.log("successfully");
        if (!delete_coupon) return await res.status(200).send({ status: 200, message: "no data there", data: delete_coupon })
        else return await res.status(200).send({ status: 200, message: "order deleted successfully", data: delete_coupon })
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}

module.exports = { createCoupon, getCoupons, updateCoupon, deletetCoupon }
