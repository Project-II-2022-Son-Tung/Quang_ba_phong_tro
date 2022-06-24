"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'QLPT',
    username: "postgres",
    password: "Chucthanhlam1907",
    logging: true,
    entities: ['src/entities/*.ts'],
    migrations: ['/migrations/*.ts']
});
exports.default = AppDataSource;
//# sourceMappingURL=data-source-2.js.map