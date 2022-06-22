"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const Admin_1 = require("./entities/Admin");
const Contract_1 = require("./entities/Contract");
const Identification_1 = require("./entities/Identification");
const Invite_1 = require("./entities/Invite");
const Owner_1 = require("./entities/Owner");
const OwnerHistory_1 = require("./entities/OwnerHistory");
const OwnerRate_1 = require("./entities/OwnerRate");
const RateImage_1 = require("./entities/RateImage");
const Room_1 = require("./entities/Room");
const RoomImage_1 = require("./entities/RoomImage");
const RoomRate_1 = require("./entities/RoomRate");
const User_1 = require("./entities/User");
const UserHistory_1 = require("./entities/UserHistory");
const Wallet_1 = require("./entities/Wallet");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    ...(constants_1.__prod__ ?
        {
            url: process.env.DATABASE_URL,
        }
        : {
            database: 'QLPT',
            username: process.env.DB_USER_DEV,
            password: process.env.DB_PASS_DEV
        }),
    logging: true,
    ...(constants_1.__prod__ ? {
        extra: {
            ssl: {
                rejectUnauthorized: false
            }
        },
        ssl: true
    } : {}),
    ...(constants_1.__prod__ ? {} : { synchronize: true }),
    entities: [Admin_1.Admin, User_1.User, Owner_1.Owner, UserHistory_1.UserHistory, RoomRate_1.RoomRate, RoomImage_1.RoomImage, Room_1.Room, RateImage_1.RateImage, OwnerRate_1.OwnerRate, OwnerHistory_1.OwnerHistory, Invite_1.Invite, Identification_1.Identification, Contract_1.Contract, Wallet_1.Wallet],
    migrations: [path_1.default.join(__dirname, '/migrations/*')]
});
//# sourceMappingURL=data-source.js.map