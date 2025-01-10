import { db } from "@lib/database";
import s3 from "@lib/s3";
import HttpException from "@shared/classes/http.exception";
import { CreateProductDto } from "@shared/dto/product.dto";
import { StatusCodes } from "http-status-codes";


async function findOne(id:number) {
       const product = await db.product.findFirst({
        include:{
          detail:true
        },
        where: {
          id
        }
       })
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, ["product not found"])
      if(product.image){
        product.image = await s3.getSignedUrlAsync(product.image)
      }
      return product
}
async function findAll() {
  const products = await db.product.findMany({
    include:
    {
      detail:true
    }})

  const productsWithSignedUrls = await Promise.all(
    products.map(async (p) => {
      const { image, ...product } = p;
      if (!image) return { ...product, image: null };
      const signedUrl = await s3.getSignedUrlAsync(image); // Ensure this function is async if it uses `await`
      return { ...product, image: signedUrl };
    })
  );

  return productsWithSignedUrls;
}


async function create(products: CreateProductDto[]) {
  await db.$transaction(async(trx)=>{

    const promises = products.map(async(product)=>{
      const {image,...rest} = product
      if(!image) return rest
      const uploadedFile = await s3.upload(image)
      return {...rest,image:uploadedFile}
    })
    const newProducts = await Promise.all(promises)
    await trx.product.createMany({
      data:newProducts
    })

  })
    //
}

export default {
    findAll,
    create,
    findOne
}