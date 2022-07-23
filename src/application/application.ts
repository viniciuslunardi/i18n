import Server from '../server/server';

import ConvertController from '../controller/convert';

export type Controllers = [ConvertController];

export default class Application {
  private _server!: Server; // definite assignment assertion
  
  public async init(): Promise<void> {
    console.log('Initializing Application...');

    this._server = Server.instance;

    const controllers: Controllers = [
      new ConvertController(this._server.router),
    ];

    this._server.initializeControllers(controllers);
    this._server.initializeErrorMiddlewares();
  }

  get server(): Server {
    return this._server;
  }
}