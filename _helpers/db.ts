import config from 'config.json';
import mysql, { Connection } from 'mysql2/promise';
import { Sequelize } from 'sequelize';

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const db: { User?: any } = {};

initialize();

async function initialize(): Promise<void> {
    const { host, port, user, password, database }: DatabaseConfig = config.database;
    const connection: Connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize: Sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    db.User = require('../users/user.model')(sequelize);
    
    await sequelize.sync({ alter: true });
}