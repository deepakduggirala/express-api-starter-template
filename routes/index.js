const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.send('OK');
});

router.use('/users', require('./users'));

module.exports = router;
