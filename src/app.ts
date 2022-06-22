import 'reflect-metadata';
import express, { Request } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {
  Action,
  getMetadataArgsStorage,
  RoutingControllersOptions,
  UnauthorizedError,
  useExpressServer,
} from 'routing-controllers';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUiExpress from 'swagger-ui-express';
import expressBasicAuth from 'express-basic-auth';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import './config/config.service';
import { isJWT } from 'class-validator';
import * as http from 'http';
import * as socketio from 'socket.io';
import { redisClient } from './config/redis-client';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { CategoryController } from './category/category.controller';
import { SkillController } from './skill/skill.controller';
import { ClientController } from './clients/client.controller';
import { ServiceProductController } from './serviceProduct/serviceProduct.controller';
import { CurrentUserOnRedisDocument } from './user/currentUserOnRedis.interface';
import { JobProductController } from './jobProduct/jobProduct.controller';
import { NewsController } from './news/news.controller';
import { TicketController } from './ticket/ticket.controller';
import { OfferController } from './Offer/offer.controller';
import { OrderController } from './order/order.controller';
import { WalletController } from './wallet/wallet.controller';
import { TransactionController } from './transaction/transaction.controller';
import agenda from './agenda';
import { GeoController } from './geo/geo.controller';

async function authorizationChecker(action: Action, roles: string[]) {
  const req: Request = action.request;
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !isJWT(token)) {
    throw new UnauthorizedError('Unauthorized Error !');
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const { email, role } = user as Record<string, string>;
    const userTokens = await redisClient.keys(`auth:${email}*`);
    if (!roles.includes(role)) {
      return false;
    }
    return userTokens.some(async (key) => {
      const currentToken = await redisClient.get(key);
      return currentToken === token;
    });
  } catch (e) {
    throw new UnauthorizedError(e.message);
  }
}
async function currentUserChecker(action: Action) {
  const req: Request = action.request;
  try {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(' ');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const curUser: any = jwt.decode(token);
    const user = {
      _id: curUser.user_id,
      email: curUser.email,
      type: curUser.role,
    } as CurrentUserOnRedisDocument;
    return user;
  } catch (e) {
    return null;
  }
}
async function bootstrap() {
  mongoose
    .connect(process.env.MONGODB_CONN_STRING)
    .then(() => {
      console.log('MongoDB connected!');
    })
    .catch((e) => {
      console.log(e);
      console.log('MongoDB connection error, exitting.');
      process.exit(1);
    });

  await redisClient.connect();
  const app = express();
  const env: 'development' | 'production' = app.get('env');
  await agenda.start();
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.use(cors());
  app.use(express.json());

  const routingControllersOptions: RoutingControllersOptions = {
    plainToClassTransformOptions: {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    },
    controllers: [
      UserController,
      AuthController,
      GeoController,
      CategoryController,
      SkillController,
      ClientController,
      ServiceProductController,
      JobProductController,
      NewsController,
      TicketController,
      OfferController,
      OrderController,
      WalletController,
      TransactionController,
    ],
    authorizationChecker,
    currentUserChecker,
  };
  useExpressServer(app, routingControllersOptions);

  if (process.env.SWAGGER_UI_ENABLED === 'true') {
    console.log('Swagger UI is enabled on /docs route!');
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });
    const storage = getMetadataArgsStorage();
    const serverPrefix = process.env.SWAGGER_UI_SERVER_PREFIX || '';
    const servers = serverPrefix !== '' ? [{ url: serverPrefix }] : [];

    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      servers,
      components: {
        schemas,
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
    });

    app.use(
      '/docs',
      expressBasicAuth({
        users: {
          [process.env.SWAGGER_UI_USERNAME]: process.env.SWAGGER_UI_PASSWORD,
        },
        challenge: true,
      }),
      swaggerUiExpress.serve,
      swaggerUiExpress.setup(spec),
    );
  }

  const PORT = Number.parseInt(process.env.PORT, 10) || 7000;
  const server = http.createServer(app);
  const io = new socketio.Server(server, {
    cors: {
      origin: '*', // this must be config with client origin in the future
    },
  });
  server.listen(PORT, () => {
    console.log(`Express app running on port ${PORT} in ${env} mode!`);
  });
  global.io = io;
  io.on('connection', (socket) => {
    socket.on('join', async (data) => {
      socket.join(data.user_id); // join user into socket io room
    });
  });
  app.all('*', (req, res) => {
    if (!res.headersSent) {
      res.status(404).send('Invalid request.');
    }
  });
}

bootstrap();
process.on('exit', () => {
  redisClient.quit();
  mongoose.disconnect();
});
