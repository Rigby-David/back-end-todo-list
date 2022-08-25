const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  description;
  user_id;
  complete;

  constructor(row) {
    this.id = row.id;
    this.description = row.description;
    this.user_id = row.user_id;
    this.complete = row.complete;
  }

  static async insert({ description, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO full_stack_todos (description, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [description, user_id]
    );

    return new Todo(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM full_stack_todos
      WHERE user_id = $1
      `,
      [user_id]
    );
    return rows.map((row) => new Todo(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * from full_stack_todos
      WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async updateById(id, newAttributes) {
    const todo = await Todo.getById(id);
    if (!todo) return null;
    const updatedData = { ...todo, ...newAttributes };
    const { rows } = await pool.query(
      `UPDATE full_stack_todos
      SET description = $2, complete = $3
      WHERE id = $1
      RETURNING *`,
      [id, updatedData.description, updatedData.complete]
    );
    return new Todo(rows[0]);
  }
};
