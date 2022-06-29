import path from "path";
// import { createClient } from "redis";
import "reflect-metadata"
import { DataSource } from "typeorm"
import { __prod__ } from "./constants";
import { Admin } from "./entities/Admin";
import { Contract } from "./entities/Contract";
import { Districts } from "./entities/Districts";
import { Identification } from "./entities/Identification";
import { Invite } from "./entities/Invite";
import { Owner } from "./entities/Owner";
import { OwnerHistory } from "./entities/OwnerHistory";
import { OwnerRate } from "./entities/OwnerRate";
import { Provinces } from "./entities/Provinces";
import { RateImage } from "./entities/RateImage";
import { Room } from "./entities/Room";
import { RoomFavourite } from "./entities/RoomFavourite";
import { RoomImage } from "./entities/RoomImage";
import { RoomRate } from "./entities/RoomRate";
import { User } from "./entities/User";
import { UserHistory } from "./entities/UserHistory";
import { Wallet } from "./entities/Wallet";
import { Wards } from "./entities/Wards";

export const AppDataSource = new DataSource({
    type: 'postgres',
        ...(__prod__ ?
          {
            url: process.env.DATABASE_URL,
          }
          : {
          database: 'QLPT',
          username: process.env.DB_USER_DEV,
          password: process.env.DB_PASS_DEV
          }),
        logging: true,
        ...(__prod__ ? {
          extra: {
            ssl: {
              rejectUnauthorized: false
            }
          },
          ssl: true
        } : {}),
        ...(__prod__ ? {} : {synchronize: true} ),
        entities: [Admin, User, Owner, UserHistory, RoomRate, RoomImage, Room, RateImage, OwnerRate, OwnerHistory, Invite, Identification, Contract, Wallet, Provinces, Districts, Wards, RoomFavourite],    
        migrations: [path.join(__dirname, '/migrations/*')]
});
// export const RedisClient = createClient(
//   __prod__ ? {
//     url: process.env.REDIS_URL
//   } : {
//     url: `redis://localhost:6379`
//   }
// );
// RedisClient.on('error', () => {
//   console.log('Redis connection error.');
// });

// RedisClient.on('connect', () => {
//   console.log(`Redis client connected on port 6379!`);
// });

