import { upload } from "@lib/multer";
import resize from "@lib/sharp";
import HttpException from "@shared/classes/http.exception";
import MultipartFile from "@shared/classes/multipartfile";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default function handleFile(
  fileName: string,
  config?: { required?: boolean; allowedMimeTypes?: string[] }
) {
  const f = upload.single(fileName);

  return (req: Request, res: Response, next: NextFunction) => {
    f(req, res, async (err) => {
      if (err) {
        // Handle Multer errors
        return next(
          new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, err.message)
        );
      }

      // Check if file is required but not provided
      if (config?.required && !req.file) {
        return next(
          new HttpException(StatusCodes.BAD_REQUEST, [
            `${fileName} is required`,
          ])
        );
      }

      // Check allowed MIME types
      if (config?.allowedMimeTypes && req.file) {
        if (!config.allowedMimeTypes.includes(req.file.mimetype)) {
          return next(
            new HttpException(
              StatusCodes.BAD_REQUEST,
              [
                `Invalid MIME type for ${fileName}. Allowed types: ${config.allowedMimeTypes.join(
                  ", "
                )}`,
              ]
            )
          );
        }
      }

      // Convert numeric strings to numbers in request body
      req.body = convertNumericStrings(req.body);

      // Wrap Multer's file object into MultipartFile
      if (req.file) {
        const resized = await resize(req.file)
        req.body[fileName] = resized;
      }

      // Proceed to the next middleware if no errors
      next();
    });
  };
}

// Helper function to convert numeric strings to numbers
function convertNumericStrings(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertNumericStrings);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        isNumeric(value) ? Number(value) : convertNumericStrings(value),
      ])
    );
  }
  return obj;
}

// Helper function to check if a value is a numeric string
function isNumeric(value: any): boolean {
  return typeof value === "string" && !isNaN(value as any) && !isNaN(parseFloat(value));
}
