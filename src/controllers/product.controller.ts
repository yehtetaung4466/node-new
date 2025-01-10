import DAO from '@shared/classes/dao';
import { CreateProductDto, productCreateDto } from '@shared/dto/product.dto';
import productService from '@shared/services/product.service';
import validate from '@shared/validators/validate';
import { Request, Response } from 'express'
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

const create = expressAsyncHandler(
    async(req:Request, res:Response) => {
        const data = validate(req.body,productCreateDto)
        await productService.create([data])
        const r = new DAO(['Success']);
        res.status(StatusCodes.CREATED).json(r)
    }
)
const all = expressAsyncHandler(
    async(req:Request, res:Response) => {
        const products = await productService.findAll()
          const r = new DAO(['products'], products);
          res.json(r)
    }
)

const one = expressAsyncHandler(
    async(req:Request, res:Response) => {
        const id = req.params.id
        const product = await productService.findOne(+id)
        const r = new DAO(['product'], product);
        res.json(r)
    }
)

export default {
    all,
    create,
    one
}
