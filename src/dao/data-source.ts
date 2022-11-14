import "reflect-metadata"
import { DataSource } from "typeorm"

const AppDataSourceDEV = new DataSource({
    type: "mysql",
    host: process.env.DEV_DB_HOST,
    port: parseInt(process.env.DEV_DB_PORT) ,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PWD,
    database: process.env.DEV_DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [`${__dirname}/../entity/*[.ts,.js]`],
    migrations: [`${__dirname}/../migration/*[.ts,.js]`],
    subscribers: [],
})
const AppDataSourcePROD = new DataSource({
    type: "mysql",
    host: process.env.PROD_DB_HOST,
    port: parseInt(process.env.PROD_DB_PORT) ,
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PWD,
    database: process.env.PROD_DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [`${__dirname}/../entity/*[.ts,.js]`],
    migrations: [`${__dirname}/../migration/*[.ts,.js]`],
    subscribers: [],
})


export const AppDataSource = process.env.PROD === 'true' ? AppDataSourcePROD : AppDataSourceDEV