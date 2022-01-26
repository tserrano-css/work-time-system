import { join } from 'path';
import { ConnectionOptions } from 'typeorm';

/*export default () => ({
  app_port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNC === 'true',
    autoLoadEntities: true,
  },
  jwt: {
    jwt_access_expiresin:
      parseInt(process.env.JWT_ACCESS_EXPIRESIN) || 2592000000, //Segundos
    jwt_secret: process.env.JWT_SECRETKEY,
  },
});*/

export default () => {
  let databaseUrl = process.env.DATABASE_URL;

  const ssl_config = {
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };

  if (!databaseUrl) {
    const username = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;
    const database = process.env.DATABASE_NAME;
    const host = process.env.DATABASE_HOST;
    const port = parseInt(process.env.DATABASE_PORT, 10) || 5432;
    databaseUrl = `postgres://${username}:${password}@${host}:${port}/${database}`;
  }

  const jwt_access_expiresin = process.env.JWT_ACCESS_EXPIRESIN
    ? parseInt(process.env.JWT_ACCESS_EXPIRESIN, 10)
    : 2592000000;
  const jwt_secret = process.env.JWT_SECRETKEY
    ? process.env.JWT_SECRETKEY
    : 'defaultjwtsecret';

  const config = {
    app_port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      type: 'postgres',
      autoLoadEntities: true,
      url: databaseUrl,
      ...(process.env.NODE_ENV === 'production' ? { ...ssl_config } : {}), //Si es producción agrego la configuración de ssl
      dropSchema: process.env.DATABASE_DROP_SCHEMA === 'true',
      migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === 'true',
      migrationsTableName: 'migrations_typeorm',
      logging: process.env.DATABASE_MIGRATIONS_LOGGIN == 'true',
      entities: [join(__dirname, '../**/**/*entity{.ts,.js}')],
      migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')], //Se usa para identificar el directorio de migraciones
      cli: {
        migrationsDir: 'migrations', // Se usa para indicar el directorio donde se guardan las migraciones
      },
    } as ConnectionOptions,
    jwt: {
      jwt_access_expiresin: jwt_access_expiresin, //seconds
      jwt_secret: jwt_secret,
    },
  };

  return config;
};
