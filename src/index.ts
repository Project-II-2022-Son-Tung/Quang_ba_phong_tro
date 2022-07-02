import cors from "cors";
import express from "express";
import { __prod__ } from "./constants";
import { AppDataSource } from "./data-source";
//import helmet from 'helmet';
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from "./types/MyContext";
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";
import { createClient } from "redis";
import { AdminResolver } from "./resolvers/admin";
import { OwnerResolver } from "./resolvers/owner";
import { RoomResolver } from "./resolvers/room";
import { ProvincesResolver } from "./resolvers/province";
import { DistrictsResolver } from "./resolvers/district";
import { WardsResolver } from "./resolvers/ward";
import { RoomFavouriteResolver } from "./resolvers/roomFavourite";
import { InviteResolver } from "./resolvers/invite";


const main = async () => {
    await AppDataSource.initialize();
	console.log("Initialized data source");
    if(__prod__) {
    await AppDataSource.runMigrations();
    }
    const app = express();
    app.use(
		cors({
			origin: __prod__
				? process.env.CORS_ORIGIN_PROD
				: process.env.CORS_ORIGIN_DEV,
			credentials: true
		})
	);
	
	// app.use(
	// 	helmet({
	// 	  contentSecurityPolicy: false,
	// 	}),
	//   );
	app.use(express.json());
	app.set('trust proxy', 1);
	const redisClient = createClient(
		__prod__ ? {
			url: process.env.REDISCLOUD_URL,
			legacyMode: true
		} : {
			url: `redis://localhost:6379`,
			legacyMode: true
		}
	);

	redisClient.on('error', () => {
	console.log('Redis connection error.');
	});

	redisClient.on('connect', () => {
	console.log(`Redis client connected`);
	});

	redisClient.connect();

	const RedisStore = connectRedis(session);

	app.use(
        session({
			name: process.env.COOKIE_NAME,
            //store: new RedisStore(__prod__ ? {host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT)} : {host: 'localhost', port: 6379}),
			store: new RedisStore({client: redisClient as any}),
			cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                secure: __prod__ || false,
                sameSite: __prod__ ? 'none' : 'lax'
            },
            secret: process.env.SECRET_KEY || 'ThisIsASeCretKey123456789',
            resave: false,
            saveUninitialized: false
        })
    )

	
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
		  resolvers: [UserResolver, AdminResolver, OwnerResolver, RoomResolver, ProvincesResolver, DistrictsResolver, WardsResolver, RoomFavouriteResolver, InviteResolver], 
		  validate: false,
		}),
		context: ({ req, res }): MyContext => ({ req, res, connection: AppDataSource.manager }),
		introspection: true,
		csrfPrevention: true,
		plugins: [__prod__ 
				  ? ApolloServerPluginLandingPageProductionDefault({
					footer: false,
				  })
				  : ApolloServerPluginLandingPageGraphQLPlayground()],
		
	});
	await apolloServer.start();
	apolloServer.applyMiddleware({app, cors: false});
  	const PORT = process.env.PORT || 5000;
  
	app.post('/auth', (req, res) => {
		console.log(req.body);
		res.send('Hello World!');
	});
  	app.listen(PORT, () => {
    	console.log(`Server started on port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`);
  	});
};

main().catch(err => {
	console.error(err);
	process.exit(1);
});
