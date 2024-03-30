const RatingRepository = require('../repositories/RatingRepository');
const { connectToPostgreSQL,disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { FinalRating, TmpRating } = require('../models');

describe('RatingRepository', () => {

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
    });
    
  describe('addInitialRatings', () => {
    it('should add initial ratings for each image', async () => {
      const email = 'test@example.com';
      const images = [{ id: 1 }, { id: 2 }, { id: 3 }];

      await RatingRepository.addInitialRatings(email, images);

      // Check if initial ratings are added to the TmpRating table
      const tmpRatings = await TmpRating.findAll({ where: { email } });
      expect(tmpRatings.length).toEqual(images.length);
    });
  });

  describe('changeRating', () => {
    it('should change the rating of a specific image', async () => {
      const email = 'test@example.com';
      const imageId = "1";
      const fromBasket = 0;
      const toBasket = 1;

      // Insert a dummy rating into the TmpRating table
      await TmpRating.create({ email, imageId, rating: fromBasket });
     
      // Call the method being tested
      await RatingRepository.changeRating(email, imageId, fromBasket, toBasket);

      // Check if the rating is updated in the TmpRating table
      const updatedRating = await TmpRating.findOne({ where: { email, imageId } });
      expect(updatedRating.rating).toEqual(toBasket);
    });

    it('should throw an error if the rating to change does not exist', async () => {
      const email = 'test@example.com';
      const imageId = "1";
      const fromBasket = 0;
      const toBasket = 1;

      // Call the method being tested and expect it to throw an error
      await expect(RatingRepository.changeRating(email, imageId, fromBasket, toBasket)).rejects.toThrowError('Rating not found');
    });
  });

  describe('saveRatings', () => {
    it('should save temporary ratings to final ratings and delete them from temporary ratings table', async () => {
        // Mock data
        const email = 'test@example.com';
        const tmpRatings = [
          { email, imageId: 1, rating: 3 },
          { email, imageId: 2, rating: 4 },
        ];
      
        // Mock TmpRating.findAll to return temporary ratings
        jest.spyOn(TmpRating, 'findAll').mockResolvedValue(tmpRatings);
      
        // Mock FinalRating.create to simulate saving to final ratings
        const createMock = jest.spyOn(FinalRating, 'create').mockResolvedValue();
      
        // Mock TmpRating.destroy to simulate deleting from temporary ratings
        jest.spyOn(TmpRating, 'destroy').mockResolvedValue();
      
        // Call the method being tested
        await RatingRepository.saveRatings(email);
      
        // Assertions
        expect(createMock).toHaveBeenCalledTimes(tmpRatings.length);
        tmpRatings.forEach((tmpRating) => {
          expect(createMock).toHaveBeenCalledWith({
            email: tmpRating.email,
            imageId: tmpRating.imageId,
            rating: tmpRating.rating,
          });
        });
        expect(TmpRating.destroy).toHaveBeenCalledWith({ where: { email } });
    });
});
      

  describe('saveOldRatings', () => {
    it('should save ratings older than one day to final ratings', async () => {
        // Mock data
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const oldEmails = [{ email: 'old1@example.com' }, { email: 'old2@example.com' }];
      
        // Mock TmpRating.findAll to return emails with old ratings
        jest.spyOn(TmpRating, 'findAll').mockResolvedValue(oldEmails);
      
        // Mock RatingRepository.saveRatings to simulate saving old ratings
        const saveRatingsMock = jest.spyOn(RatingRepository, 'saveRatings').mockResolvedValue();
      
        // Call the method being tested
        await RatingRepository.saveOldRatings();
      
        // Assertions
        expect(saveRatingsMock).toHaveBeenCalledTimes(oldEmails.length);
        oldEmails.forEach((emailObj) => {
          expect(saveRatingsMock).toHaveBeenCalledWith(emailObj.email);
        });
      });
      
  });
});
