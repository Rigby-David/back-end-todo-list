const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('#POST /api/v1/todos creates a new todo', async () => {
    const [agent, user] = await registerAndLogin();
    const todo = { description: 'laundry' };
    const res = await agent.post('/api/v1/todos').send(todo);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      description: todo.description,
      user_id: user.id,
      complete: false,
    });
  });
  it('#GET /api/v1/todos shows a list of all todos for the auth user', async () => {
    const [agent, user] = await registerAndLogin();
    const todo = { description: 'sweep' };
    const res = await agent.post('/api/v1/todos').send(todo);
    expect(res.status).toBe(200);

    const resp = await agent.get('/api/v1/todos');
    expect(resp.body.length).toBe(1);
    expect(resp.body[0]).toEqual({
      id: expect.any(String),
      description: 'mow',
      user_id: user.id,
      complete: false,
    });
  });
});
