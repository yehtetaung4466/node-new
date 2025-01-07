import { Type } from "@aws-sdk/client-s3";
import { z } from "zod";

export const productCreateDto = z.object({
    name:z.string().min(1).max(255),
    price:z.number().min(0),
    image:z.string().min(1).max(255),
})
export type CreateProductDto = z.infer<typeof productCreateDto>