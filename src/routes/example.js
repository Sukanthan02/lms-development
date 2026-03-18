// Sample example route
const express = require('express');
const router = express.Router();

// Example GET endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Example route',
    data: []
  });
});

// Example POST endpoint
router.post('/', (req, res) => {
  const { body } = req;
  
  res.status(201).json({
    status: 'success',
    message: 'Data created successfully',
    data: body
  });
});

module.exports = router;
