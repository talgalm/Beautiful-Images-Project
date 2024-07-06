const AuthController = require('../Controllers/AuthController');
const UserRepository = require('../repositories/UserRepository');
const { generateAccessToken } = require('../tokens/tokens');
const logger = require('../logger');

// Mock generateAccessToken globally
jest.mock('../tokens/tokens', () => ({
  generateAccessToken: jest.fn().mockReturnValue('mocked-token')
}));

// Mock UserRepository methods
jest.mock('../repositories/UserRepository', () => ({
  authenticateUser: jest.fn(),
  registerUser: jest.fn()
}));

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return login successful with token and nickname on successful login', async () => {
      const email = 'test@example.com';
      const user = { nickname: 'TestUser' };

      req.body.email = email;
      UserRepository.authenticateUser.mockResolvedValue(user);

      await AuthController.login(req, res);

      expect(UserRepository.authenticateUser).toHaveBeenCalledWith(email);
      expect(generateAccessToken).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'mocked-token', nickname: 'TestUser' });
    });

    it('should return error message on login failure', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Invalid credentials';

      req.body.email = email;
      UserRepository.authenticateUser.mockRejectedValue(new Error(errorMessage));

      await AuthController.login(req, res);

      expect(UserRepository.authenticateUser).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

  });

  describe('register', () => {
    it('should return user registered successfully on successful registration', async () => {
      const newUser = {
        email: 'newuser@example.com',
        nickname: 'NewUser',
        age: 25,
        country: 'USA',
        gender: 'male'
      };

      req.body = newUser;
      UserRepository.registerUser.mockResolvedValue();

      await AuthController.register(req, res);

      expect(UserRepository.registerUser).toHaveBeenCalledWith(newUser.email,newUser.age, newUser.gender, newUser.country, newUser.nickname, );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    it('should return error message on registration failure', async () => {
      const newUser = {
        email: 'newuser@example.com',
        nickname: 'NewUser',
        age: 25,
        country: 'USA',
        gender: 'male'
      };
      const errorMessage = 'Registration failed';

      req.body = newUser;
      UserRepository.registerUser.mockRejectedValue(new Error(errorMessage));

      await AuthController.register(req, res);

      expect(UserRepository.registerUser).toHaveBeenCalledWith(newUser.email, newUser.age, newUser.gender, newUser.country, newUser.nickname);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should return error message on registration failure unexpected error', async () => {
      const newUser = {
        email: 'newuser@example.com',
        nickname: 'NewUser',
        age: 25,
        country: 'USA',
        gender: 'male'
      };
      const errorMessage = 'Unexpected error';

      req.body = newUser;
      UserRepository.registerUser.mockRejectedValue(new Error(errorMessage));

      await AuthController.register(req, res);

      expect(UserRepository.registerUser).toHaveBeenCalledWith(newUser.email, newUser.age, newUser.gender, newUser.country, newUser.nickname);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
