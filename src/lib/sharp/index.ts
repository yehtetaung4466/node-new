import MultipartFile from "@shared/classes/multipartfile";
import sharp from "sharp";
export default async function resize(file:MultipartFile) {
    const resized = await sharp(file.buffer).resize(800, 800).webp().toBuffer()
    file.buffer = resized
    file.mimetype = 'image/webp'
    file.originalname = file.originalname.split('.')[0] + '.webp'
    return new MultipartFile(file)
}