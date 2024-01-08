import { Sequelize } from "sequelize";
import fs from 'fs';
import 'dotenv/config';

export const db = new Sequelize(
    process.env.DB!,
    process.env.DBUSER!,
    process.env.DBPWD!,
    {
        host: '192.168.1.4',
        dialect: 'postgres',
        logging: false,
        port: 5432,
        define: {
            freezeTableName: true,
            timestamps: false
        }
    });