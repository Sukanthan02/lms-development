const env = process.env.NODE_ENV || 'development';

const configs = {
  development: {
    username: "root",
    password: "yakkay", // Default development password
    database: "lms",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: "root",
    password: "password",
    database: "lms_test",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false
  },
  production: {
    username: "root",
    password: "Yakkay@123", // Production credentials
    database: "edj",
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

module.exports = configs[env];
