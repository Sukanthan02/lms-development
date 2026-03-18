const db = require('../src/models');

(async () => {
  try {
    console.log('Syncing database (altering tables to add new columns)...');
    await db.sequelize.sync({ alter: true });
    console.log('✓ Database synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
})();
