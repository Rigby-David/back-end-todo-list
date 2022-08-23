const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const mockUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: '123456',
};

// const registerAndLogin = async (userProps = {}) => {
//   const password = userProps.password ?? mockUser.password;

//   // Create an "agent" that gives us the ability
//   // to store cookies between requests in a test
//   const agent = request.agent(app);

//   // Create a user to sign in with
//   // const user = await UserService.create({ ...mockUser, ...userProps });

//   // ...then sign in
//   // const { email } = user;
//   const resp = await agent
//     .post('/api/v1/users')
//     .send({ ...mockUser, ...userProps });
//   const user = resp.body;
//   return [agent, user];
// };

describe('user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const { firstName, lastName, email } = mockUser;
    console.log('res.body', res.body);
    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });
});
