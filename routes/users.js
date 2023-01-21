const express = require('express');
const { query, param } = require('express-validator');

const logger = require('../logger');
const validator = require('../middleware/validator');

const router = express.Router();

router.get('/', (req, res, next) => {
  logger.info('in users', { foo: 'bar' });
  res.send({ message: 'Hello world' });
});

router.get(
  '/:id',
  param('id').toInt(),
  query('sortby').default('asc').isIn(['asc', 'desc']),
  validator(async (req, res, next) => {
    logger.info(`in users - ${req.params.id}, ${req.query.sortby}`);
    res.send({ message: 'Hello world' });
  }),
);

module.exports = router;
