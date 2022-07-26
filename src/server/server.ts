import express, { Router } from 'express';
import bodyParser from 'body-parser';
import http from 'http';

import { missingRouteMiddleware, corsMiddleware } from './middlewares';

import { Controllers } from '@src/application/application';

export default class Server {
  private readonly _app: express.Express;
  public serverApp: http.Server;
  private static _instance: Server;

  private _router: Router = Router();

  constructor() {
    this._app = express();

    const port = process.env.PORT || '3000';
    this.serverApp = this.listen(parseInt(port));
    this.initializeMiddlewares();
  }

  static get instance(): Server {
    if (!Server._instance) {
      Server._instance = new Server();
    }

    return Server._instance;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  public initializeErrorMiddlewares() {
    this.app.use(missingRouteMiddleware);
    this.app.use(corsMiddleware);
  }

  public initializeControllers(controllers: Controllers): void {
    for (const controller of controllers) {
      console.info(`Creating route ${controller.getName()}`);
      this.app.use('/api', controller.router);
    }
  }

  get router(): Router {
    return this._router;
  }

  private listen(port: number): http.Server {
    return this._app.listen(port, () =>
      console.info('Process running on ' + port)
    );
  }

  get app(): express.Express {
    return this._app;
  }

  public async destroy(): Promise<void> {
    await this.serverApp.close();
  }
}