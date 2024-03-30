const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { connectToPostgreSQL,disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { Image, FinalRating, TmpRating } = require("../models");
const ImageRepository = require("../repositories/ImageRepository");
const RatingRepository = require("../repositories/RatingRepository");

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
        await TmpRating.destroy({ where: {} })
        await FinalRating.destroy({ where: {} })
        await Image.destroy({ where: {} })

    });

    describe('fetchImages', () => {
        it('should fetch new images if userTmpRatings is empty', async () => {
          const email = 'test@example.com';
    
          // Mock TmpRating.findAll to return an empty array
          const findAllMock = jest.spyOn(TmpRating, 'findAll').mockResolvedValue([]);
    
          // Mock fetchNewImages method
          ImageRepository.fetchNewImages = jest.fn().mockResolvedValueOnce(['image1', 'image2']);
    
          const result = await ImageRepository.fetchImages(email);
    
          // Assert that TmpRating.findAll is called with the correct arguments
          expect(findAllMock).toHaveBeenCalledWith({ where: { email } });
    
          // Assert that fetchNewImages is called with the correct arguments
          expect(ImageRepository.fetchNewImages).toHaveBeenCalledWith(email);
    
          // Assert the returned data
          expect(result).toEqual(['image1', 'image2']);
    
          // Restore the original implementation of TmpRating.findAll
          findAllMock.mockRestore();
        });
    
        it('should fetch session images if userTmpRatings is not empty', async () => {
          const email = 'test@example.com';
    
          // Mock TmpRating.findAll to return a non-empty array
          const findAllMock = jest.spyOn(TmpRating, 'findAll').mockResolvedValue(['rating1', 'rating2']);
    
          // Mock fetchSessionImages method
          ImageRepository.fetchSessionImages = jest.fn().mockResolvedValueOnce(['image3', 'image4']);
    
          const result = await ImageRepository.fetchImages(email);
    
          // Assert that TmpRating.findAll is called with the correct arguments
          expect(findAllMock).toHaveBeenCalledWith({ where: { email } });
    
          // Assert that fetchSessionImages is called with the correct arguments
          expect(ImageRepository.fetchSessionImages).toHaveBeenCalledWith(email);
    
          // Assert the returned data
          expect(result).toEqual(['image3', 'image4']);
    
          // Restore the original implementation of TmpRating.findAll
          findAllMock.mockRestore();
        });
    });

        describe('fetchImage', () => {
            it('should fetch the image with the provided imageId', async () => {
              // Mock data
              const imageId = 'test-image-id';
              const image = {
                id: imageId,
                category: 'test-category',
                imageName: 'test-image.jpg'
              };
              const imageData = 'fakeImageData';
        
              // Mock Image.findOne to return the mock image data
              const findOneMock = jest.spyOn(Image, 'findOne').mockResolvedValue(image);
        
              // Mock fs.readFileSync to return the mock image data
              const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockReturnValue(imageData);
        
              // Call the function
              const result = await ImageRepository.fetchImage(imageId);
        
              // Assert that Image.findOne is called with the correct arguments
              expect(Image.findOne).toHaveBeenCalledWith({ where: { id: imageId } });
        
              // Assert that fs.readFileSync is called with the correct arguments
              expect(fs.readFileSync).toHaveBeenCalledWith(
                path.join(__dirname, `../../images/original/${image.category}`, image.imageName),
                { encoding: 'base64' }
              );
        
              // Assert the returned data
              expect(result).toEqual({ imageId: image.id, imageData });
        
              // Restore the original implementations
              findOneMock.mockRestore();
              readFileSyncMock.mockRestore();
            });
    
      });
          
});
