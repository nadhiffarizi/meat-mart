import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import authRouter from './routers/auth.router';
import adminRouter from './routers/admin.router';
import cartRouter from './routers/cart.router';
import productRouter from './routers/product.router';
import userRouter from './routers/user.router';
import discountRouter from './routers/discount.router';
import transactionRouter from './routers/transaction.router';
import orderRouter from './routers/order.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    this.app.use('/api/auth', authRouter.getRouter());
    this.app.use('/api/admin', adminRouter.getRouter());
    this.app.use('/api/order', orderRouter.getRouter());
    this.app.use('/api/cart', cartRouter.getRouter());
    this.app.use('/api/products', productRouter.getRouter());
    this.app.use('/api/user', userRouter.getRouter());
    this.app.use('/api/transaction', transactionRouter.getRouter());
    this.app.use('/api/discount', discountRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜ Hello from [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
