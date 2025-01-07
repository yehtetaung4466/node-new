
import DAO from '@shared/classes/dao';
import HttpException from '@shared/classes/http.exception';
import { productCreateDto } from '@shared/dto/product.dto';
import exceptionHandler from '@shared/middlewares/exception.handler';
import validate from '@shared/validators/validate';
import { config } from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

config();

const app = express();
const port = process.env.PORT!;

app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  const data = validate(req.body,productCreateDto)
  const r = new DAO(['hello world!'],[]);
  res.json(r)
});
// Simulate a route with an error
app.get('/error', (req, res) => {
  throw new Error('This is a test error!');
});

// Handle 404 errors (route not found)
app.use((req, res, next) => {
  const error = new HttpException(StatusCodes.NOT_FOUND,['Route not found'])
  next(error);
});

// Centralized error handler
app.use(exceptionHandler);
console.log(process.env.NODE_ENV);
console.log('hi');
console.log('an');




app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}/`);
  
});
//