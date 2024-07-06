const { execSync } = require('child_process');
const RatingRepository = require('../repositories/RatingRepository');
const { connectToPostgreSQL, disconnectFromPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { Rating, Image, Category } = require('../Models');
const { where } = require('sequelize');

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
        await Image.destroy({where: {}})
        await Category.destroy({where: {}})
    });

    describe('addInitialRatings', () => {
        it('should add initial ratings for each image', async () => {
            const userId = 'test-user';
            const images = [{ id: 1 }, { id: 2 }, { id: 3 }];

            await RatingRepository.addInitialRatings(userId, images);

            // Check if initial ratings are added to the Rating table
            const tmpRatings = await Rating.findAll({ where: { userId, type: "tmp" } });
            expect(tmpRatings.length).toEqual(images.length);
        });
    });

    describe('changeRating', () => {
        it('should change the rating of a specific image', async () => {
            const userId = "555";
            const imageId = "1";
            const fromBasket = 0;
            const toBasket = 1;

            // Insert a dummy rating into the Rating table
            await Rating.create({ imageId: imageId, userId: userId, rating: fromBasket, type: "tmp", submittedFrom: "test", createdAt: new Date(), updatedAt: new Date() });

            // Call the method being tested
            await RatingRepository.changeRating(userId, imageId, fromBasket, toBasket, 'test-source');
      
            // Check if the rating is updated in the Rating table
            const updatedRating = await Rating.findOne({ where: { userId, imageId, type: "tmp" } });
            expect(updatedRating.rating).toEqual(toBasket);
        });

        it('should throw an error if the rating to change does not exist', async () => {
            const userId = 'test-user';
            const imageId = "1";
            const fromBasket = 0;
            const toBasket = 1;

            // Call the method being tested and expect it to throw an error
            await expect(RatingRepository.changeRating(userId, imageId, fromBasket, toBasket, 'test-source'))
                .rejects.toThrowError('Rating not found');
        });
    });

    describe('saveRatings', () => {
        it('should change temporary ratings to final ratings', async () => {
            const userId = 'test-user';
            const tmpRatings = [
                { userId, imageId: "1", rating: 3, type: 'tmp' },
                { userId, imageId: "2", rating: 4, type: 'tmp' },
            ];

            await Rating.bulkCreate(tmpRatings);

            await RatingRepository.saveRatings(userId);

            const finalRatings = await Rating.findAll({ where: { userId, type: 'final' } });
            expect(finalRatings.length).toEqual(tmpRatings.length);
            finalRatings.forEach((rating, index) => {
                expect(rating.rating).toEqual(tmpRatings[index].rating);
                expect(rating.type).toEqual('final');
            });
        });
    });

    describe('saveOldRatings', () => {
        it('should save ratings older than one day to final ratings', async () => {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const oldRatings = [
                { userId: 'user1', imageId: "1", rating: 3, type: 'tmp', updatedAt: oneDayAgo },
                { userId: 'user2', imageId: "2", rating: 4, type: 'tmp', updatedAt: oneDayAgo },
            ];

            await Rating.bulkCreate(oldRatings);

            await RatingRepository.saveOldRatings();

            const finalRatings = await Rating.findAll({ where: { type: 'final' } });
            console.log(finalRatings);
            expect(finalRatings.length).toEqual(oldRatings.length);
        });
    });

    describe('getAllRatings', () => {
        it('should return all ratings with related image and category information', async () => {
          const image = await Image.create({ id: 1, imageName: 'Test Image', categoryId: 1 });
          const category = await Category.create({ id: 1, categoryName: 'Test Category' });
          const rating = await Rating.create({ imageId: image.id, userId: 'user1', rating: 5, type: 'final' });

          const ratings = await RatingRepository.getAllRatings();

          expect(ratings.length).toEqual(1);
          expect(ratings[0].imageName).toEqual(image.imageName);
          expect(ratings[0].imageCategory).toEqual(category.categoryName);
          expect(ratings[0].rating).toEqual(rating.rating);
        });
    });

    describe('getImageRatings', () => {
        it('should return all ratings for a specific image with related information', async () => {
            const image = await Image.create({ id: 1, imageName: 'Test Image', categoryId: 1 });
            const category = await Category.create({ id: 1, categoryName: 'Test Category' });
            const rating = await Rating.create({ imageId: image.id, userId: 'user1', rating: 5, type: 'final' });

            const ratings = await RatingRepository.getImageRatings(image.id);

            expect(ratings.length).toEqual(1);
            expect(ratings[0].imageName).toEqual(image.imageName);
            expect(ratings[0].imageCategory).toEqual(category.categoryName);
            expect(ratings[0].rating).toEqual(rating.rating);
        });
    });

    describe('getAverageImageRating', () => {
        it('should return the average rating for a specific image', async () => {
            const imageId = "1";
            await Rating.bulkCreate([
                { imageId: imageId, userId: 'user1', rating: 5, type: 'final' },
                { imageId: imageId, userId: 'user2', rating: 3, type: 'final' },
            ]);

            const averageRating = await RatingRepository.getAverageImageRating(imageId);

            expect(averageRating).toEqual(4);
        });
    });

    describe('getAmountOfRatings', () => {
        it('should return the number of ratings for a specific image', async () => {
            const imageId = "1";
            await Rating.bulkCreate([
                { imageId: imageId, userId: 'user1', rating: 5, type: 'final' },
                { imageId: imageId, userId: 'user2', rating: 3, type: 'final' },
            ]);

            const count = await RatingRepository.getAmountOfRatings(imageId);

            expect(count).toEqual(2);
        });
    });

    describe('getUserRatings', () => {
        it('should return all ratings for a specific user', async () => {
            const userId = 'user1';
            await Rating.bulkCreate([
                { imageId: "1", userId: userId, rating: 5, type: 'final' },
                { imageId: "2", userId: userId, rating: 3, type: 'final' },
            ]);

            const ratings = await RatingRepository.getUserRatings(userId);

            expect(ratings.length).toEqual(2);
            expect(ratings[0].userId).toEqual(userId);
        });
    });

    describe('deleteRatings', () => {
        it('should delete all ratings for a specific image', async () => {
            const imageId = "1";
            await Rating.bulkCreate([
                { imageId: imageId, userId: 'user1', rating: 5, type: 'final' },
                { imageId: imageId, userId: 'user2', rating: 3, type: 'final' },
            ]);

            await RatingRepository.deleteRatings(imageId);

            const ratings = await Rating.findAll({ where: { imageId: imageId } });

            expect(ratings.length).toEqual(0);
        });
    });

});
