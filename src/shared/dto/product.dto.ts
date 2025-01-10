import { Type } from "@aws-sdk/client-s3";
import MultipartFile from "@shared/classes/multipartfile";
import { z } from "zod";

export const productCreateDto = z.object({
    name:z.string({message:'name is required'}).min(1).max(255),
    price:z.number().min(0),
    image:z.instanceof(MultipartFile).optional(),
})
export type CreateProductDto = z.infer<typeof productCreateDto>