const db = require('../src/models');
const fs = require('fs');
(async () => {
  await db.sequelize.authenticate();
  const rows = await db.sequelize.query(
    'SELECT c.categorytoken, c.name as catName, s.subcategorytoken, s.name as subName FROM categories c JOIN sub_categories s ON c.id = s.categoryId ORDER BY c.id, s.id',
    { type: db.Sequelize.QueryTypes.SELECT, logging: false }
  );
  fs.writeFileSync('scripts/tokens.json', JSON.stringify(rows, null, 2));
  console.log('Written to scripts/tokens.json');
  process.exit(0);
})();
