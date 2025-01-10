
import HttpException from '@shared/classes/http.exception';
import exceptionHandler from '@shared/middlewares/exception.handler';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import express, {  } from 'express';
import { StatusCodes } from 'http-status-codes';
import productRouter from 'routes/product.route';

config();

const app = express();
const port = process.env.PORT!;

app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//     allowedHeaders: "Content-Type,Authorization",
//     methods: "GET,PUT,POST,PATCH,DELETE",
//   })
// );
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev"));
app.use(cookieParser());

app.use('/api/products',productRouter)

app.use((req, res, next) => {
  const error = new HttpException(StatusCodes.NOT_FOUND,['Route not found'])
  next(error);
});
app.use(exceptionHandler);
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}/`);
  
});
//