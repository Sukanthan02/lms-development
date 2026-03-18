const { Sequelize } = require('sequelize');
const path = require('path');
const config = require(path.join(__dirname, '../config/database.js'));

async function ensureDatabase() {
  // Connect to MySQL without a database name
  const sequelize = new Sequelize('', config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('✓ Connected to MySQL server');
    
    // Create the database if it doesn't exist
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    console.log(`✓ Database '${config.database}' ensured`);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to ensure database:', error.message);
    process.exit(1);
  }
}

ensureDatabase();
