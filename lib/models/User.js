const pool = require('../utils/pool');

module.exports = class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash; // private class field: hides it from anything outside of this class definition

  constructor(row) {
    this.id = row.id;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, passwordHash, firstName, lastName }) {
    const { rows } = await pool.query(
      `
      INSERT INTO full_stack_users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [email, passwordHash, firstName, lastName]
    );

    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
