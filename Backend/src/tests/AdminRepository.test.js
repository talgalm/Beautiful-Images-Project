const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { connectToPostgreSQL, disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { Image, Rating, User } = require("../Models");
const AdminRepository = require('../repositories/AdminRepository');
const RatingRepository = require('../repositories/RatingRepository');
const ImageRepository = require('../repositories/ImageRepository');
const UserRepository = require('../repositories/UserRepository');

// Mock logger
jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock fs and PDFDocument
//jest.mock('fs');
jest.mock('pdfkit');

describe('AdminRepository', () => {

  beforeAll(async () => {
    await connectToPostgreSQL();
    await connectToSequelize();
  });

  afterAll(async () => {
    await disconnectFromPostgreSQL();
  });

  afterEach(async () => {
    await Rating.destroy({ where: {} });
    await Image.destroy({ where: {} });
    await User.destroy({ where: {} });
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  describe('getParticipantsData', () => {
    it('should get participants data using mock', async () => {

        const userId1 = "1";
        const userId2 = "2";
        const users = [
            { id: userId1, age: 20, gender: 'male', country: 'France' },
            { id: userId2, age: 28, gender: 'female', country: 'Germany' },
        ];

        const ratings = [
            { id: 1, userId :userId1, imageId: "1", rating: 3, type: 'final' },
            { id: 2, userId: userId2, imageId: "2", rating: 4, type: 'final' },
        ];

        jest.spyOn(User, 'findAll').mockResolvedValue(users);
        jest.spyOn(Rating, 'findAll').mockResolvedValue(ratings);

        const result = await AdminRepository.getParticipantsData();
        
        expect(result).toEqual(users);
    });

    it('should get participants data excluding admin fields', async () => {

        const userId1 = "1";
        const userId2 = "2";
        const userId3 = "3";
        const users = [
            { id: userId1, email: "user1@email", nickname:"user1", age: 20, gender: 'male', country: 'FRANCE', password: "123", isAdmin: true },
            { id: userId2, email: "user2@email", nickname:"user2", age: 28, gender: 'female', country: 'CANADA', isAdmin: false },
            { id: userId3, email: "user3@email", nickname:"user3", age: 25, gender: 'female', country: 'ISRAEL', isAdmin: false },
        ];

        await User.bulkCreate(users);

        const ratings = [
            { id: 1, userId :userId1, imageId: "1", rating: 3, type: 'final' },
            { id: 2, userId: userId2, imageId: "2", rating: 4, type: 'final' },
            { id: 3, userId: userId2, imageId: "3", rating: 7, type: 'final' },
            { id: 4, userId: userId3, imageId: "2", rating: 5, type: 'final' },
        ];

        await Rating.bulkCreate(ratings);

        const result = await AdminRepository.getParticipantsData();
        
        expect(result.length).toEqual(2);
    });

    it('should get participants data excluding participants that did not completed experiment', async () => {

        const userId1 = "4";
        const userId2 = "5";
        const userId3 = "6";
        
        const users = [
            { id: userId1, email: "user1@email", nickname:"user1", age: 20, gender: 'male', country: 'FRANCE', isAdmin: false },
            { id: userId2, email: "user2@email", nickname:"user2", age: 28, gender: 'female', country: 'CANADA', isAdmin: false },
            { id: userId3, email: "user3@email", nickname:"user3", age: 25, gender: 'female', country: 'ISRAEL', isAdmin: false },
            { id: "7", email: "user4@email", nickname:"user4", age: 36, gender: 'male', country: 'USA', isAdmin: false },
        ];

        await User.bulkCreate(users);

        const ratings = [
            { id: 1, userId :userId1, imageId: "1", rating: 7, type: 'final' },
            { id: 2, userId: userId2, imageId: "2", rating: 10, type: 'final' },
            { id: 2, userId: userId3, imageId: "2", rating: 10, type: 'tmp' }
        ];

        await Rating.bulkCreate(ratings);

        const result = await AdminRepository.getParticipantsData();
       
        expect(result.length).toEqual(2);
    });
   });

});
