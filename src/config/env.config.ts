export default () => ({
  app: {
    prefix: process.env.APP_PREFIX ?? "api",
    mode: process.env.NODE_ENV,
    isProd:
      process.env.NODE_ENV == "prod" || process.env.NODE_ENV == "production",
    isStagingOrProd:
      process.env.NODE_ENV == "prod" ||
      process.env.NODE_ENV == "production" ||
      process.env.NODE_ENV == "staging",
    name: process.env.APP_NAME,
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USER,
    name: process.env.DATABASE_NAME,
  },
  rabbit: {
    exchange: process.env.RABBIT_EXCHANGE_NAME,
    uri: process.env.RABBIT_URI,
    durable: process.env.RABBIT_DURABLE,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expTime: process.env.JWT_EXPIRATION_TIME
  }
  
});
