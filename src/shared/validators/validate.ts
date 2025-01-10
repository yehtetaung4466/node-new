import HttpException from "@shared/classes/http.exception";
import { StatusCodes } from "http-status-codes";
import { ZodSchema } from "zod";

export default <T>(data:any,schema:ZodSchema<T>) =>{
    const parsed = schema.safeParse(data)
    if(parsed.success){
        return parsed.data
    }else {
        const error = parsed.error.issues.map((issue)=>{
            return issue.message
        })
        throw new HttpException(StatusCodes.BAD_REQUEST,error)
    }
}