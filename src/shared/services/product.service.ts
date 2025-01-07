import { db, schema } from "@lib/database";
import s3 from "@lib/s3";
import HttpException from "@shared/classes/http.exception";
import { CreateProductDto } from "@shared/dto/product.dto";
import { StatusCodes } from "http-status-codes";


async function findOne(id:number) {
    const product = await db.query.product.findFirst({
        where: (product, { eq }) => eq(product.id, id),
      });
      if(!product) throw new HttpException(StatusCodes.NOT_FOUND, ["product not found"])
      if(product.image){
        product.image = await s3.getSignedUrlSync(product.image)
      }
      return product
}
async function findAll() {
  const products = await db.query.product.findMany({
    orderBy: (fields, operators) => {
      return operators.desc(fields.id);
    },
  });

  const productsWithSignedUrls = await Promise.all(
    products.map(async (p) => {
      const { image, ...product } = p;
      if (!image) return { ...product, image: null };
      const signedUrl = await s3.getSignedUrlSync(image); // Ensure this function is async if it uses `await`
      return { ...product, image: signedUrl };
    })
  );

  return productsWithSignedUrls;
}


async function create(products: CreateProductDto[]) {
  await db.transaction(async(trx)=>{
    const promises = products.map(async(product)=>{
      const {image,...rest} = product
      if(!image) return rest
      const uploadedFile = await s3.upload(image)
      return {...rest,image:uploadedFile}
    })
    const newProducts = await Promise.all(promises)

    await trx.insert(schema.product).values(newProducts).returning()
  })
    //
}

export default {
    findAll,
    create,
    findOne
}