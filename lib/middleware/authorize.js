const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const todo = await Todo.getById(req.params.id);
    if (req.user.id !== todo.user_id)
      throw new Error('You are not authorized to complete this action');

    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
