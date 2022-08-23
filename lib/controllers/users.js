const { Router } = require('express');
const UserService = require('../services/UserService');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.SECURE_COOKIES === 'true',
          sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
          maxAge: ONE_DAY_IN_MS,
        })
        .json(user);
    } catch (e) {
      next(e);
    }
  })
  .get('/me', authenticate, async (req, res, next) => {
    try {
      stuff;
    } catch (e) {
      next(e);
    }
  });
//   .post('/sessions', async (req, res, next) => {
//     try {
//       const { email, password } = req.body;
//       const sessionToken = await UserService.signIn({ email, password });

//       res
//         .cookie(process.env.COOKIE_NAME, sessionToken, {
//           httpOnly: true,
//           secure: process.env.SECURE_COOKIES === 'true',
//           sameSite: process.env.SECURE_COOKIES === 'true' ? 'none' : 'strict',
//           maxAge: ONE_DAY_IN_MS,
//         })
//         .json({ message: 'Signed in successfully!' });
//     } catch (error) {
//       next(error);
//     }
//   });
