const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const todos = await Todo.insert({
      user_id: req.user.id,
      ...req.body,
    });
    res.json(todos);
  } catch (e) {
    next(e);
  }
});
