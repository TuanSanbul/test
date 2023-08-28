export const config = {
  db: {
    type: process.env.DB_TYPE || 'postgres',
    synchronize: false,
    logging: process.env.ENV !== 'develop' ? true : false,
    replication: {
      master: {
        host: process.env.DB_HOST || 'masterHost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER || 'username',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'dbname',
      },
      slaves: [
        {
          // fix if necessary
          host: 'slaveHost',
          port: 5432,
          username: 'username',
          password: 'password',
          database: 'dbname',
        },
      ],
    },
    extra: {
      connectionLimit: 30,
    },
    autoLoadEntities: true,
  },
  graphql: {
    debug: false,
    playground: false,
  },
  foo: 'pro-bar',
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretExpireIn: process.env.JWT_SECRET_EXPIRE_IN || '1d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshSecretExpireIn: process.env.JWT_REFRESH_EXPIRE_IN || '7d',
  fileConfig: {
    directory: './public/upload',
    limitSize: 1024 * 1024, //1MB
  },
  mongo: {
    uri:
      process.env.DB_MONGO_URI || 'mongodb://root:root@localhost:27017/admin',
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  rootApi: 'api',
  adminGateway: {
    port: 3000,
  },
  userGateway: {
    port: 3030,
  },
  authService: {
    transport: 0,
    host: '0.0.0.0',
    port: 3001,
  },
  configService: {
    transport: 0,
    host: '0.0.0.0',
    port: 3002,
  },
  memberService: {
    transport: 0,
    options: {
      host: '0.0.0.0',
      port: 3003,
    },
  },
};
