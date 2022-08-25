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
    const todo = { description: 'mow' };
    const res = await agent.post('/api/v1/todos').send(todo);
    console.log('res.body', res.body);
    expect(res.status).toBe(200);

    const resp = await agent.get('/api/v1/todos');
    console.log('resp.body', resp.body);
    console.log('resp.body.length', resp.body.length);
    expect(resp.body.length).toBe(1);
    expect(resp.body[0]).toEqual({
      id: expect.any(String),
      description: 'mow',
      user_id: user.id,
      complete: false,
    });
  });
  it('#PUT /api/v1/todos/:id allows an auth user to complete a todo', async () => {
    const [agent, user] = await registerAndLogin();
    const todo = { description: 'mow' };
    const res = await agent.post('/api/v1/todos').send(todo);
    expect(res.status).toBe(200);

    const resp = await agent.put('/api/v1/todos/1').send({ complete: true });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      description: 'mow',
      user_id: user.id,
      complete: true,
    });
  });
  it('#DELETE /api/v1/todos/:id user can delete a task', async () => {
    const todo = { description: 'mow' };
    const agent = request.agent(app);
    await agent.post('api/v1/users').send(mockUser);

    const response = await agent.post('/api/v1/todos').send(todo);
    expect(response.status).toBe(200);
  });
});
