import DAO from '@shared/classes/dao';
import { CreateProductDto, productCreateDto } from '@shared/dto/product.dto';
import productService from '@shared/services/product.service';
import validate from '@shared/validators/validate';
import express from 'express'
const product = express.Router()
product.get('/', async(req, res) => {
    const products = await productService.findAll()
      const r = new DAO(['products'], products);
      res.json(r)
})
product.post('/', async(req, res) => {
    const data = validate(req.body,productCreateDto)
    const product = await productService.create([data])
    const r = new DAO(['product'], product);
    res.json(r)
})
