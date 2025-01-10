import productController from '@controller/product.controller'
import { upload } from '@lib/multer'
import handleFile from '@shared/middlewares/file.middleware'
import express from 'express'
const productRouter = express.Router()


productRouter.get('/',productController.all)
productRouter.get('/:id', productController.one)


productRouter.post('/',handleFile('image',{required:false}),productController.create)


export default productRouter