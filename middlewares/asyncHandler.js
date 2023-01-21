// Needed to wrap async routes in express to handle errors properly
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const asyncMiddleware = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncMiddleware;

// const asyncMiddleware = require('./utils/asyncMiddleware');

// router.get('/users/:id', asyncMiddleware(async (req, res, next) => {
//     /*
//       if there is an error thrown in getUserFromDb, asyncMiddleware
//       will pass it to next() and express will handle the error;
//     */
//     const user = await getUserFromDb({ id: req.params.id })
//     res.json(user);
// }));

// router.post('/users', asyncMiddleware(async (req, res, next) => {
//   const user = await makeNewUser(req.body);
//   res.json(user)
// }))
