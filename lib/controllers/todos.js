const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const todos = await Todo.insert({
        user_id: req.user.id,
        ...req.body,
      });
      res.json(todos);
    } catch (e) {
      next(e);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const todos = await Todo.getAll(req.user.id);
      console.log('req.user.id', req.user.id);
      res.json(todos);
    } catch (e) {
      next(e);
    }
  });
