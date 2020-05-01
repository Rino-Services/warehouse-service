import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as morgan from "morgan";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { PassportAuthenticator, Server } from "typescript-rest";
import { logger } from "./common/logger";

export class App {
  public PORT: number = +process.env.PORT || 3000;
  private readonly app: express.Application;
  private server: http.Server = null;

  constructor() {
    this.app = express();
    this.config();

    Server.buildServices(this.app);
    Server.loadServices(this.app, "domains/**/controllers/*", __dirname);
    Server.swagger(this.app, { filePath: "./dist/swagger.json" });
  }

  public async start() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.PORT, (err: any) => {
        if (err) {
          return reject(err);
        }
        logger.info(`Sever on > http://localhost:${this.PORT}`);
        return resolve();
      });
    });
  }

  public async stop(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      if (this.server) {
        this.server.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    });
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(morgan("combined"));
    this.configureAuthentication();
  }

  private configureAuthentication() {
    const JWT_SECRET: string = "some-jwt-secret";
    const jwtConfig: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(JWT_SECRET)
    };
    const strategy = new Strategy(
      jwtConfig,
      (payload: any, done: (err: any, user: any) => void) => {
        done(null, payload);
      }
    );
    const authenticator = new PassportAuthenticator(strategy, {
      deserializeUser: (user: string) => JSON.parse(user),
      serializeUser: (user: any) => {
        return JSON.stringify(user);
      }
    });
    Server.registerAuthenticator(authenticator);
    Server.registerAuthenticator(authenticator, "secondAuthenticator");
  }
}
