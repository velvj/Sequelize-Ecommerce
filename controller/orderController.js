const orderDb = require('../models');
const orderDatas = orderDb.orders
const { Op, DATEONLY } = require("sequelize");
const { date } = require('joi');
const productDB = require('../models');
const productsData = productDB.Products;
const pdf = require('pdf-creator-node')
var fs = require("fs");
var html = fs.readFileSync("model.html", "utf8");
const nodemailer = require('nodemailer');
const { google } = require('googleapis')


const pdfMail = async (orderData, dataList) => {

  try {
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Order Data</div>'
      },
      footer: {
        height: "28mm",
        contents: {
          first: 'Cover page',
          // 2: 'Second page', // Any page number is working. 1-based index
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page'
        }
      }
    };

    // var users = [{
    //   customerID: orderData.customerID,
    //   productID: orderData.productID,
    //   address: orderData.shippingAddress.address,
    //   city: orderData.shippingAddress.city,
    //   postalCode: orderData.shippingAddress.postalCode,
    //   country: orderData.shippingAddress.country,
    //   totalAmount: orderData.totalAmount,
    //   created: orderData.created,
    //   couponID: orderData.couponID,
    //   productName: dataList[0].productName,
    //   brand:dataList[0].brand,
    //   model: dataList[0].model,
    //   category:dataList[0].category,
    //   price: dataList[0].price,
    //   date:dataList[0].date,
    //   color:dataList[0].color,
    //   qty: dataList[0].qty,
    //   productNames: dataList[1].productName,
    //   brands:dataList[1].brand,
    //   models: dataList[1].model,
    //   categorys:dataList[1].category,
    //   prices: dataList[1].price,
    //   dates:dataList[1].date,
    //   colosr:dataList[1].color,
    //   qtys: dataList[1].qty

    // }];

    // const userslist = {
    //   orderData: orderData,
    //   datas: dataList[0],
    //   dataitem: dataList[1]
    // }
    //  const testing = {
    //       orderData,
    //       datas: dataList[0],
    //       dataitem: dataList[1]
    //     }

    // for(let i = 0; i<dataList.length; i++){
    //   console.log(i)
    // }

    var document = {
      html: html,
      data: {
        users: {
          ...orderData,
          pro: dataList
        }
      },
      path: "./output.pdf",
      // type: "",
    };

    // console.log(document.data,"ddg");
    pdf.create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
    const CLIENT_ID = '160245785177-mfh70ult1tcs7r7npbhlhr90jedvvmdp.apps.googleusercontent.com'
    const CLIENT_SECRET = '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'
    const REFRESH_TOKEN = '1//04F0aXYDezEeBCgYIARAAGAQSNwF-L9IrlmkX__xoNlMdQjFggKdrEvJozpz9rucr1-aUdavNyHBVefkDqAaNLq6I78O48zwUxlg'
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAUTH2',
        user: 'veljack732@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    })
    // var dataPath ={filename:'C:\\Node Task\\nodesql\\output.pdf'}
    const mailOptions = {
      from: 'veljack732@gmail.com',
      to: process.env.TO_ID,
      subject: 'please find the order Data PFA',
      html: `<p>You requested for email verification, kindly use this <a href=http://localhost:3000/user/PDF/hi >link</a> to find PDF DATA</p>`,
      attachments: {
        path: 'C:\\Node Task\\nodesql\\output.pdf'
      }
    };
    const result = transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      return console.log("Message sent: %s", info.messageId, info)
    })


  } catch (err) {
    return console.log("Message sent: %s", err);

  }
}

//create Order

const createOrder = async (req, res) => {
  try {
    var id = req.body.productID
    const dataList = await productsData.findAll({
      where: {
        productID: {
          [Op.in]: id
        }
      }, raw: true
    });
    const price = await dataList.reduce((pre, curr) => {
      pre = pre + curr.price
      return pre
    }, 0)
    const orderlist = {

      customerID: req.body.customerID,
      productID: req.body.productID,
      shippingAddress: {
        address: req.body.shippingAddress.address,
        city: req.body.shippingAddress.city,
        postalCode: req.body.shippingAddress.postalCode,
        country: req.body.shippingAddress.country
      },
      totalAmount: price,
      created: req.body.created,
      couponID: req.body.couponID
    }
    let orderData = await orderDatas.create(orderlist);
    console.log(dataList, "user DATA");
    pdfMail(orderData, dataList)
    return res.status(200).send({ status: 200, message: "order created successfully", data: orderData })
  } catch (err) {
    return res.status(400).json({ status: 400, message: err.message || err });
  }
}




//get order discount and amount

const getOrderID = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9]{1,99}$/)) {
      return res.status(400).json({ status: 400, message: "Order ID not found" })
    }
    const Id = req.params.id
    let getproduct = await orderDatas.findOne({ where: { id: Id } })
    if (!getproduct.couponID) {
      return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: getproduct })
    } else {
      let getproduct = await orderDatas.findAll({ where: { id: Id }, include: ['customer', "coupons"], raw: true, nest: true })
      const allData = await getproduct.reduce((acc, curr) => {
        acc = [...acc, ...curr.productID]
        return acc

      }, [])
      const myData = await productsData.findAll({
        where: {
          productID: {
            [Op.in]: allData
          }
        }, raw: true
      });

      getproduct = getproduct.map((val) => {
        val.productID = val.productID.map((data) => {
          let productDetails = myData.find((obj) => obj.productID == data)
          return { ...productDetails };
        })
        return val;
      })
      // console.log(getproduct[0].coupons.endDate, "saravan")
      const lastDate = new Date(getproduct[0].coupons.endDate);
      const currentDate = new Date();
      if ((lastDate >= currentDate) && (getproduct[0].coupons.couponStatus)) {
        if (getproduct[0].coupons.type === "discount") {
          var getDiscount = await getproduct[0].totalAmount - (getproduct[0].totalAmount * getproduct[0].coupons.value / 100);
          let final = { getproduct, finalAmount: getDiscount, discounted: getproduct[0].totalAmount - getDiscount }
          return res.status(200).send({ status: 200, message: "Discount Percentage Data", data: final })
        }
        else if (getproduct[0].coupons.type === "amount") {
          let getamount = await getproduct[0].totalAmount - getproduct[0].coupons.value;
          let final = { getproduct, finalAmount: getamount, discounted: getproduct[0].totalAmount - getamount }
          return res.status(200).send({ status: 200, message: "get order by id succesfully", data: final })
        }
      } else {
        return res.status(200).send({ status: 200, message: "Date is expired" })
      }
    }
  } catch (err) {
    res.status(400).send({ status: 400, message: err.message || err })
  }

}




//get All Data

const getOrders = async (req, res) => {
  try {

    let order_Data = await orderDatas.findAll({ include: ['customer', "coupons"], raw: true, nest: true })
    const allData = await order_Data.reduce((acc, curr) => {
      acc = [...acc, ...curr.productID]
      return acc

    }, [])
    // const  my_Data =[...new Set(allData)] 
    // // allData.add(...allData);
    //  console.log(my_Data,'hi')
    const myData = await productsData.findAll({
      where: {
        productID: {
          [Op.in]: allData
        }
      }, raw: true
    });
    console.log(myData);
    order_Data = order_Data.map((val) => {
      val.productID = val.productID.map((data) => {
        console.log(data)
        let productDetails = myData.find((obj) => obj.productID == data)
        return { ...productDetails };
      })
      return val;
    })


    // const finalData = await order_Data.concat(myData)
    return res.status(200).send({ status: 200, message: "order data details viewed successfully", data: order_Data })
  } catch (err) {
    console.log(err)
    res.status(400).send({ status: 400, message: "cannot find order datas" })
  }
}

//get order id
const getOrderById = async (req, res) => {
  try {
    const page = +req.query.page;
    const size = +req.query.size;
    const Id = req.params.id
    let orders = await orderDatas.findAll({ offset: page * size, limit: size , where: { id: Id }, raw: true, include: ['customer', "coupons"], nest: true })
    const allData = await orders.reduce((acc, curr) => {
      acc = [...acc, ...curr.productID]
      return acc

    }, [])
    const myData = await productsData.findAll({
      where: {
        productID: {
          [Op.in]: allData
        }
      }, raw: true
    });
    orders = orders.map((val) => {
      val.productID = val.productID.map((data) => {
        console.log(data)
        let productDetails = myData.find((obj) => obj.productID == data)
        return { ...productDetails };
      })
      return val
    })

    return res.status(200).send({ status: 200, message: "users details viewed successfully", data: orders })
  } catch (err) {
    console.log(err, 'err')
    res.status(400).send({ status: 400, message: "something went wrong" || err })
  }
}

//update Order
const updateOrder = async (req, res) => {
  try {
    const update = await orderDatas.update({
      customerID: req.body.customerID,
      productID: req.body.productID,
      shippingAddress: req.body.shippingAddress,
      totalAmount: req.body.totalAmount,
      created: req.body.created,
      couponID: req.body.couponID
    }, { where: { id: req.params.id } })
    if (update) {
      return res.status(200).send({ status: 200, message: "order details updated successfully", data: update })
    }
  } catch (err) {
    res.status(400).send({ status: 400, message: err })
  }
}

//deleteOrder
const deletetOrder = async (req, res) => {
  try {
    const delete_Order = await orderDatas.destroy({ where: { id: req.params.id } })
    console.log("successfully");
    if (!delete_Order) return await res.status(200).send({ status: 200, message: "no data there", data: delete_Order })
    else return await res.status(200).send({ status: 200, message: "order deleted successfully", data: delete_Order })
  } catch (err) {
    res.status(400).send({ status: 400, message: err })
  }
}
module.exports = { createOrder, getOrders, getOrderById, updateOrder, deletetOrder, getOrderID, pdfMail }