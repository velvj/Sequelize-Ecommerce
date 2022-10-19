const productDB = require('../models');
const productsData = productDB.Products;
const { Op } = require("sequelize");
const csv = require('csvtojson')
const upload = require("../middleware/uploads");

//add file

const addfile = async (req, res) => {
    try {
        upload.single('uploadData')
            (req, res, async function (error) {
                if (error) {
                    return res.json({ error: "Error uploading file" })
                }
                let csvpath = req.file.path
                console.log(csvpath, "file path");
                csv()
                    .fromFile(csvpath)
                    .then(async (csvfile) => {

                        const item = await productsData.bulkCreate(csvfile, { updateOnDuplicate: ["productName", "brand", "category", "model", "price", "date", "color", "qty"] })
                        console.log(item);

                        return res.status(200).json({ status: 200, success: `data inserted succesfully ` });
                    })
            })
    } catch (err) {
        return res.status(400).send({ status: 400, message: err.message || err })
    }
}


//create Products

const createProducts = async (req, res) => {
    try {
        const model = req.body.model;
        const productName = req.body.productName;
        const clientExist = await productsData.findOne({
            where: {
                [Op.or]: [
                    { model: model },
                    { productName: productName }
                ]
            }
        });
        if (clientExist) {

            return res.status(400).json({ message: "User already exists" });
        } else {
            const items = {
                productName: req.body.productName,
                brand: req.body.brand,
                model: req.body.model,
                category: req.body.category,
                price: req.body.price,
                date: req.body.date,
                color: req.body.color,
                qty: req.body.qty
            }
            const myData = await productsData.create(items);
            return res.status(200).send({ status: 200, message: "products created successfully", data: myData })
        }

    } catch (err) {
        res.status(400).json({ status: 400, message: err.message || err });
    }
}


//update products

const updateProducts = async (req, res) => {
    try {
        const update = await productsData.update({
            productName: req.body.productName,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category,
            price: req.body.price,
            date: req.body.date,
            color: req.body.color,
            qty: req.body.qty
        }, { where: { productID: req.params.productID } })
        if (update) {
            return res.status(200).send({ status: 200, message: "product details updated successfully", data: update })
        }
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}
//get all products

const getProducts = async (req, res) => {
    try {
        let myData = await productsData.findAll({})
        res.status(200).send({ status: 200, message: "users details viewed successfully", data: myData })
    } catch (err) {
        res.status(400).send({ status: 400, message: "cannot find user datas" })
    }
}

//getProducts ID

const getProductById = async (req, res) => {
    try {
        const Id = req.params.id
        const findID = await productsData.findOne({ where: { productID: Id } })
        res.status(200).send({ status: 200, message: "users details viewed successfully", data: findID })
    } catch (err) {
        res.status(400).send({ status: 400, message: "something went wrong" || err })
    }
}
//findByPk getProducts
const getByPkProducts = async (req, res) => {
    const Id = req.params.id
    console.log(Id);
    try {
        const testing = await productsData.findByPk(Id);
        if (testing === null) {
            res.status(400).send({ status: 400, message: "something went wrong" || err })
        } else {
            res.status(200).send({ status: 200, message: "users details viewed successfully", data: testing })
        }
    }
    catch (err) {
        res.status(400).send({ status: 400, message: err })
    }

}

//delete by ID
const deleteProduct = async (req, res) => {
    try {
        const delete_user = await productsData.destroy({ where: { productID: req.params.id } })
        console.log("successfully");
        if (!delete_user) return await res.status(200).send({ status: 200, message: "no data there", data: delete_user })
        else return await res.status(200).send({ status: 200, message: "users deleted successfully", data: delete_user })
    } catch (err) {
        res.status(400).send({ status: 400, message: err })
    }
}

//delete ALL

const deleteAllUser = async (req, res) => {
    try {
        const deleteAll = await productsData.destroy({
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


module.exports = { createProducts, updateProducts, getByPkProducts, getProducts, getProductById, deleteProduct, deleteAllUser, addfile }