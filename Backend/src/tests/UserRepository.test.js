const UserRepository = require('../repositories/UserRepository');
const { connectToPostgreSQL,disconnectFromPostgreSQL } = require('../config/pgConfig');
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
        await User.destroy({ where: {} })
        
    });

  describe('registerUser', () => {

    it('should create a new user if the email does not exist', async () => {

      const dummyUser = { id: 1, email: 'test@example.com', age: 25, gender: 'male' };

      // Call the method being tested
      const result = await UserRepository.registerUser('test@example.com', 25, 'male');

      // Check if the method returns the expected result
      expect(result.email).toEqual(dummyUser.email);
      expect(result.age).toEqual(dummyUser.age);
      expect(result.gender).toEqual(dummyUser.gender);
    });

    it('should throw an error if the email already exists', async () => {
     
      const existingUser = { email:'test@example.com' , nickname: 'nickname', age:25, country : 'country', gender:'male'};
     
      await User.create(existingUser);

      // Call the method being tested and expect it to throw an error
      await expect(UserRepository.registerUser('test@example.com', 25, 'male')).rejects.toThrowError('User with this email already exists');
    });
  });

  describe('authenticateUser', () => {
  
    it('should throw an error if the user does not exist', async () => {
  
      // Call the method being tested and expect it to throw an error
      await expect(UserRepository.authenticateUser('shay@example.com')).rejects.toThrowError('Email does not exist');
    });
  
    it('should return the user if it exists', async () => {
    
      const existingUser = { id: 1, email: 'test@example.com', age: 25, gender: 'male' };
     
      await User.create(existingUser);
  
      // Call the method being tested
      const result = await UserRepository.authenticateUser('test@example.com');
  
      // Check if the method returns the expected user
      expect(result.email).toEqual(existingUser.email);
      expect(result.age).toEqual(existingUser.age);
      expect(result.gender).toEqual(existingUser.gender);
    });
  });

});
