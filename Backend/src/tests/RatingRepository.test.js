const RatingRepository = require('../repositories/RatingRepository');
const { connectToPostgreSQL,disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { Rating } = require('../models');

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
        await Rating.destroy({ where: {} })
    });
    
  describe('addInitialRatings', () => {
    it('should add initial ratings for each image', async () => {
      const email = 'test@example.com';
      const images = [{ id: 1 }, { id: 2 }, { id: 3 }];

      await RatingRepository.addInitialRatings(email, images);

      // Check if initial ratings are added to the Rating table
      const tmpRatings = await Rating.findAll({ where: { email, type: "tmp" } });
      expect(tmpRatings.length).toEqual(images.length);
    });
  });

  describe('changeRating', () => {
    it('should change the rating of a specific image', async () => {
      const email = 'test@example.com';
      const imageId = "1";
      const fromBasket = 0;
      const toBasket = 1;

      // Insert a dummy rating into the Rating table
      await Rating.create({ email, imageId, rating: fromBasket, type: "tmp" });
     
      // Call the method being tested
      await RatingRepository.changeRating(email, imageId, fromBasket, toBasket);

      // Check if the rating is updated in the Rating table
      const updatedRating = await Rating.findOne({ where: { email, imageId, type: "tmp" } });
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
        jest.spyOn(Rating, 'findAll').mockResolvedValue(tmpRatings);
      
        // Mock FinalRating.create to simulate saving to final ratings
        const createMock = jest.spyOn(FinalRating, 'create').mockResolvedValue();
      
        // Mock TmpRating.destroy to simulate deleting from temporary ratings
        jest.spyOn(Rating, 'destroy').mockResolvedValue();
      
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
        expect(Rating.destroy).toHaveBeenCalledWith({ where: { email, type: "tmp" } });
    });
});
      

  describe('saveOldRatings', () => {
    it('should save ratings older than one day to final ratings', async () => {
        // Mock data
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const oldEmails = [{ email: 'old1@example.com' }, { email: 'old2@example.com' }];
      
        // Mock TmpRating.findAll to return emails with old ratings
        jest.spyOn(Rating, 'findAll').mockResolvedValue(oldEmails);
      
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
