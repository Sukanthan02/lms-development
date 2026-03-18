// Sample configuration file
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv === 'development';
const isProduction = nodeEnv === 'production';

const mediaUploadPath = isDevelopment
  ? path.join(__dirname, '../media/uploads/dev')
  : path.join(__dirname, '../media/uploads/prod');

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv,
  isDevelopment,
  isProduction,
  mediaUploadPath,
  database: require('./database')
};
