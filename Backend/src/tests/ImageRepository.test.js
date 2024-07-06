const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { connectToPostgreSQL, disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { Image, Rating, Category, User } = require("../Models");
const ImageRepository = require("../repositories/ImageRepository");
const RatingRepository = require("../repositories/RatingRepository");
const UserRepository = require("../repositories/UserRepository");

// Mock logger
jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('ImageRepository', () => {

    beforeAll(async () => {
        await connectToPostgreSQL();
        await connectToSequelize();
    });

    afterAll(async () => {
        await disconnectFromPostgreSQL(); // Disconnect from the PostgreSQL database after running all tests
    });

    afterEach(async () => {
        // Clean up test data after each test
        await Rating.destroy({ where: {} })
        await Image.destroy({ where: {} })
        await Category.destroy({ where: {} })
        await User.destroy({ where: {} })
    });

    describe('fetchImages', () => {
        it('should fetch new images if userTmpRatings is empty', async () => {
          const email = 'test@example.com';
          const userId = 'user1';
          
          const images = [
            { imageId: 1, imageName: "image1", categoryId: 3, visible: true },
            { imageId: 2, imageName: "image2", categoryId: 4, visible: true },
          ];

          // Mock UserRepository.getUserId to return the userId
          jest.spyOn(UserRepository, 'getUserId').mockResolvedValue(userId);
    
          // Mock Rating.findAll to return an empty array
          const findAllMock = jest.spyOn(Rating, 'findAll').mockResolvedValue([]);
    
          // Mock fetchNewImages method
          ImageRepository.fetchNewImages = jest.fn().mockResolvedValueOnce(images);
    
          const result = await ImageRepository.fetchImages(email);
    
          // Assert that Rating.findAll is called with the correct arguments
          expect(findAllMock).toHaveBeenCalledWith({ where: { userId, type: 'tmp' } });
    
          // Assert that fetchNewImages is called with the correct arguments
          expect(ImageRepository.fetchNewImages).toHaveBeenCalledWith(userId);
    
          // Assert the returned data
          expect(result).toEqual(images);
    
          // Restore the original implementation of Rating.findAll
          findAllMock.mockRestore();
        });
    
        it('should fetch session images if userTmpRatings is not empty', async () => {
          const email = 'test@example.com';
          const userId = 'user1';
          
          const images = [
            { imageId: 1, imageName: "image1", categoryId: 3, visible: true },
            { imageId: 2, imageName: "image2", categoryId: 4, visible: true },
          ];

          const tmpRatings = [
            { userId, imageId: "1", rating: 3, type: 'tmp' },
            { userId, imageId: "2", rating: 4, type: 'tmp' },
        ];

          // Mock UserRepository.getUserId to return the userId
          jest.spyOn(UserRepository, 'getUserId').mockResolvedValue(userId);
    
          // Mock Rating.findAll to return a non-empty array
          const findAllMock = jest.spyOn(Rating, 'findAll').mockResolvedValue(tmpRatings);
    
          // Mock fetchSessionImages method
          ImageRepository.fetchSessionImages = jest.fn().mockResolvedValueOnce(images);
    
          const result = await ImageRepository.fetchImages(email);
    
          // Assert that Rating.findAll is called with the correct arguments
          expect(findAllMock).toHaveBeenCalledWith({ where: { userId, type: 'tmp' } });
    
          // Assert that fetchSessionImages is called with the correct arguments
          expect(ImageRepository.fetchSessionImages).toHaveBeenCalledWith(userId);
    
          // Assert the returned data
          expect(result).toEqual(images);
    
          // Restore the original implementation of Rating.findAll
          findAllMock.mockRestore();
        });
    });

    describe('fetchImage', () => {
        it('should fetch the image with the provided imageId', async () => {
          // Mock data
          const imageId = 'test-image-id';
          const categoryId = 'test-category-id';
          const image = {
            id: imageId,
            categoryId: categoryId,
            imageName: 'test-image.jpg'
          };
          const category = {
            id: categoryId,
            categoryName: 'test-category'
          };
          const imageData = 'fakeImageData';
    
          // Mock Image.findOne to return the mock image data
          const findOneImageMock = jest.spyOn(Image, 'findOne').mockResolvedValue(image);
          const findOneCategoryMock = jest.spyOn(Category, 'findOne').mockResolvedValue(category);
    
          // Mock fs.readFileSync to return the mock image data
          const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValue(imageData);
    
          // Call the function
          const result = await ImageRepository.fetchImage(imageId);
    
          // Assert that Image.findOne is called with the correct arguments
          expect(Image.findOne).toHaveBeenCalledWith({ where: { id: imageId } });
          expect(Category.findOne).toHaveBeenCalledWith({ where: { id: categoryId } });
    
          // Assert that fs.readFileSync is called with the correct arguments
          expect(fs.readFileSync).toHaveBeenCalledWith(
            path.join(__dirname, `../../images/original/${category.categoryName}`, image.imageName),
            { encoding: 'base64' }
          );
    
          // Assert the returned data
          expect(result).toEqual({ imageId: image.id, imageData });
    
          // Restore the original implementations
          findOneImageMock.mockRestore();
          findOneCategoryMock.mockRestore();
          readFileSyncMock.mockRestore();
        });
    });

    describe('generateSmallScaleImages', () => {
      it('should call generateSmallImages for each factor', async () => {
        const generateSmallImagesMock = jest.spyOn(ImageRepository, 'generateSmallImages').mockResolvedValue();
  
        await ImageRepository.generateSmallScaleImages();
  
        expect(generateSmallImagesMock).toHaveBeenCalledTimes(3);
        expect(generateSmallImagesMock).toHaveBeenCalledWith(0.5);
        expect(generateSmallImagesMock).toHaveBeenCalledWith(0.25);
        expect(generateSmallImagesMock).toHaveBeenCalledWith(0.1);
  
        generateSmallImagesMock.mockRestore();
      });
    });

    describe('initializeImagesDB', () => {
      it('should initialize images in the database', async () => {
        const categories = [
          { id: 3, categoryName: "category1" },
          { id: 4, categoryName: "category2" },
        ];

        const images = [
          { imageId: 1, imageName: "image1", categoryId: 3, visible: true },
          { imageId: 2, imageName: "image2", categoryId: 4, visible: true },
        ];
  
        jest.spyOn(Category, 'findAll').mockResolvedValue(categories);
        jest.spyOn(fs, 'readdirSync').mockImplementation(() => images);
        jest.spyOn(Image, 'findOne').mockResolvedValue(null);
        jest.spyOn(Image, 'create').mockResolvedValue({});
  
        await ImageRepository.initializeImagesDB();
  
        expect(Image.create).toHaveBeenCalledTimes(images.length * categories.length);
  
        Category.findAll.mockRestore();
        fs.readdirSync.mockRestore();
        Image.findOne.mockRestore();
        Image.create.mockRestore();
      });
    });

    describe('initializeCategoryDB', () => {
      it('should initialize categories in the database', async () => {
        const categories = [
          { id: 3, categoryName: "category1" },
          { id: 4, categoryName: "category2" },
        ];
  
        jest.spyOn(fs, 'readdirSync').mockReturnValue(categories);
        jest.spyOn(Category, 'findOne').mockResolvedValue(null);
        jest.spyOn(Category, 'create').mockResolvedValue({});
  
        await ImageRepository.initializeCategoryDB();
  
        expect(Category.create).toHaveBeenCalledTimes(categories.length);
  
        fs.readdirSync.mockRestore();
        Category.findOne.mockRestore();
        Category.create.mockRestore();
      });
    });
});
