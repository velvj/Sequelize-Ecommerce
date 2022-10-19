const express = require('express');
const router =  express.Router();
const productRouter =require('../controller/productController');
const validation =require('../validation/valid')



router.post('/createProducts', validation.tokenAuth,validation.productValid,productRouter.createProducts)
router.put('/updateProducts/:id',validation.productValid,productRouter.updateProducts)
router.get('/productsPk/:id', validation.tokenAuth,productRouter.getByPkProducts)
router.get('/produtsAll', validation.tokenAuth,productRouter.getProducts)
router.get('/productId/:id',productRouter.getProductById)
router.delete('/deleteAll',productRouter.deleteAllUser)
router.delete('/deleteID/:id',productRouter.deleteProduct)
router.post('/addfile',productRouter.addfile)

// router.post("/addfile", uploads.single("file"),productRouter.addfile)


module.exports = router ;