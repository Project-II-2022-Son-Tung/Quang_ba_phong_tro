"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const data_source_1 = require("./data-source");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const apollo_server_core_1 = require("apollo-server-core");
const redis_1 = require("redis");
const admin_1 = require("./resolvers/admin");
const owner_1 = require("./resolvers/owner");
const room_1 = require("./resolvers/room");
const province_1 = require("./resolvers/province");
const district_1 = require("./resolvers/district");
const ward_1 = require("./resolvers/ward");
const roomFavourite_1 = require("./resolvers/roomFavourite");
const invite_1 = require("./resolvers/invite");
const main = async () => {
    await data_source_1.AppDataSource.initialize();
    console.log("Initialized data source");
    if (constants_1.__prod__) {
        await data_source_1.AppDataSource.runMigrations();
    }
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: constants_1.__prod__
            ? process.env.CORS_ORIGIN_PROD
            : process.env.CORS_ORIGIN_DEV,
        credentials: true
    }));
    app.use(express_1.default.json());
    app.set('trust proxy', 1);
    const redisClient = (0, redis_1.createClient)(constants_1.__prod__ ? {
        url: process.env.REDISCLOUD_URL,
        legacyMode: true
    } : {
        url: `redis://localhost:6379`,
        legacyMode: true
    });
    redisClient.on('error', () => {
        console.log('Redis connection error.');
    });
    redisClient.on('connect', () => {
        console.log(`Redis client connected`);
    });
    redisClient.connect();
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    app.use((0, express_session_1.default)({
        name: process.env.COOKIE_NAME,
        store: new RedisStore({ client: redisClient }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: constants_1.__prod__ || false,
            sameSite: constants_1.__prod__ ? 'none' : 'lax'
        },
        secret: process.env.SECRET_KEY || 'ThisIsASeCretKey123456789',
        resave: false,
        saveUninitialized: false
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, admin_1.AdminResolver, owner_1.OwnerResolver, room_1.RoomResolver, province_1.ProvincesResolver, district_1.DistrictsResolver, ward_1.WardsResolver, roomFavourite_1.RoomFavouriteResolver, invite_1.InviteResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({ req, res, connection: data_source_1.AppDataSource.manager }),
        introspection: true,
        csrfPrevention: true,
        plugins: [constants_1.__prod__
                ? (0, apollo_server_core_1.ApolloServerPluginLandingPageProductionDefault)({
                    footer: false,
                })
                : (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
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
//# sourceMappingURL=index.js.map