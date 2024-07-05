const UserRepository = require('../repositories/UserRepository');
const { connectToPostgreSQL, disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { User } = require('../models');

describe("UserRepository", () => {
  beforeAll(async () => {
    await connectToPostgreSQL();
    await connectToSequelize();
  });

  afterAll(async () => {
    await disconnectFromPostgreSQL(); // Disconnect from the PostgreSQL database after running all tests
  });

  afterEach(async () => {
    // Clean up test data after each test
    await User.destroy({ where: {} });
  });

  describe('registerUser', () => {
    it('should create a new user if the email does not exist', async () => {
      const dummyUser = { email: 'test@example.com', age: 25, gender: 'male', country: 'Israel', nickname: 'john' };

      // Call the method being tested
      const result = await UserRepository.registerUser(dummyUser.email, dummyUser.age, dummyUser.gender, dummyUser.country, dummyUser.nickname);

      // Check if the method returns the expected result
      expect(result.email).toEqual(dummyUser.email);
      expect(result.age).toEqual(dummyUser.age);
      expect(result.gender).toEqual(dummyUser.gender);
      expect(result.country).toEqual(dummyUser.country);
      expect(result.nickname).toEqual(dummyUser.nickname);
    });

    it('should throw an error if the email already exists', async () => {
      const existingUser = { id: 123, email: 'test@example.com', age: 25, gender: 'male', country: 'Israel', nickname: 'john' };

      await User.create(existingUser);

      // Call the method being tested and expect it to throw an error
      await expect(UserRepository.registerUser(existingUser.email, existingUser.age, existingUser.gender, existingUser.country, existingUser.nickname))
        .rejects
        .toThrowError('User with this email already exists');
    });
  });

  describe('authenticateUser', () => {
    it('should throw an error if the user does not exist', async () => {
      // Call the method being tested and expect it to throw an error
      await expect(UserRepository.authenticateUser('nonexistent@example.com'))
        .rejects
        .toThrowError('Email does not exist');
    });

    it('should return the user if it exists', async () => {
      const existingUser = { id: 1234, email: 'test@example.com', age: 25, gender: 'male', country: 'Israel', nickname: 'john' };

      await User.create(existingUser);

      // Call the method being tested
      const result = await UserRepository.authenticateUser(existingUser.email);

      // Check if the method returns the expected user
      expect(result.email).toEqual(existingUser.email);
      expect(result.age).toEqual(existingUser.age);
      expect(result.gender).toEqual(existingUser.gender);
      expect(result.country).toEqual(existingUser.country);
      expect(result.nickname).toEqual(existingUser.nickname);
    });
  });

  describe('authenticateAdmin', () => {
    it('should throw an error if the admin does not exist', async () => {
      await expect(UserRepository.authenticateAdmin('nonexistent@example.com', 'password'))
        .rejects
        .toThrowError('Email does not exist');
    });

    it('should return the admin if it exists', async () => {
      const adminUser = { id: 5678, email: 'admin@example.com', password: 'password', isAdmin: true };

      await User.create(adminUser);

      const result = await UserRepository.authenticateAdmin(adminUser.email, adminUser.password);

      expect(result.email).toEqual(adminUser.email);
      expect(result.password).toEqual(adminUser.password);
      expect(result.isAdmin).toEqual(true);
    });
  });

  describe('getUserId', () => {
    it('should throw an error if the email is invalid', async () => {
      await expect(UserRepository.getUserId('invalid@example.com'))
        .rejects
        .toThrowError('Invalid email');
    });

    it('should return the user ID if the email is valid', async () => {
      const existingUser = { id: '098e7654-e89b-12d3-a456-426614174000', email: 'userid@example.com', age: 40, gender: 'female', country: 'UK', nickname: 'susan' };

      await User.create(existingUser);

      const result = await UserRepository.getUserId(existingUser.email);

      expect(result).toEqual(existingUser.id);
    });
  });

  describe('getAllUsers', () => {
    it('should return an empty array if no users exist', async () => {
      const result = await UserRepository.getAllUsers();

      expect(result).toEqual([]);
    });

    it('should return all users if they exist', async () => {
      const users = [
        { id: '111e2222-e89b-12d3-a456-426614174000', email: 'user1@example.com', age: 20, gender: 'male', country: 'France', nickname: 'paul' },
        { id: '333e4444-e89b-12d3-a456-426614174000', email: 'user2@example.com', age: 28, gender: 'female', country: 'Germany', nickname: 'lisa' },
      ];

      await User.bulkCreate(users);

      const result = await UserRepository.getAllUsers();

      expect(result.length).toEqual(2);
      expect(result[0].email).toEqual(users[0].email);
      expect(result[1].email).toEqual(users[1].email);
    });
  });
});