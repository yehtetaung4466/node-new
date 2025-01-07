import { StatusCodes } from "http-status-codes";
import DAO from "./dao";

export default class HttpException extends DAO<undefined> {
    constructor(public status:StatusCodes,public message:string[],) {

        super(message);
    }
}