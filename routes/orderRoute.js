const express = require('express');
const router = express.Router();
const ordersData = require('../controller/orderController');
const validation =require('../validation/valid')


//order routers
router.post ('/createOrder', validation.tokenAuth,ordersData.createOrder)
router.get ('/getOrder', validation.tokenAuth,ordersData.getOrders)
router.get ('/getOrderById/:id',ordersData.getOrderById)
router.get ('/getId/:id',ordersData.getOrderID)
router.put ('/updateOrder/:id',ordersData.updateOrder)
router.delete ('/deleteOrder/:id',ordersData.deletetOrder)
router.put ('/pdfMail',ordersData.pdfMail)




module.exports = router;