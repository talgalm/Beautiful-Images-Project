const { Rating, Image, Category } = require("../Models");
const { Op } = require("sequelize");
const logger = require('../logger');

class RatingRepository {
    static async addInitialRatings(userId, images) {
        console.log('images: ', images.length);
        let ids = images.map((image) => image.id);
        ids.sort();
        console.log('ids: ', ids);
        await Promise.all(images.map(async (image) => {
            console.log('adding initial rating for image: ', image.id, ' userId: ', userId);
            await Rating.create({
                imageId: image.id,
                userId,
                rating: 0,
                type: "tmp",
                submittedFrom: 'initial',
                updatedAt: new Date().toISOString().substring(0, 19).replace('T', ' ')
            });
        }));
    }

    static async changeRating(userId, imageId, fromBasket, toBasket, submittedFrom) {
      logger.info(`RatingRepository - changeRating request by userId ${userId} imageId: ${imageId} fromBasket: ${fromBasket} toBasket: ${toBasket} submittedFrom: ${submittedFrom}`);
        const rating = await Rating.findOne(
            { where: { userId, imageId, rating: fromBasket, type: "tmp" } });
        if (!rating) {
            throw new Error('Rating not found');
        }
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (rating.createdAt < oneDayAgo) {
            throw new Error('Rating is older than 24 hours');
        }
        
        const updatedRating = await Rating.update({  
          submittedFrom: submittedFrom,
          rating: toBasket,  
        }, { 
          where: { userId, imageId, rating: fromBasket} 
        });

        return updatedRating;
    }

    static async saveRatings(userId) {
        //await Rating.destroy( {where: { userId, type: "tmp", rating: 0 }}); //remove images with rating 0 from the table
        logger.info(`saveRatings - save all tmp ratings for user : ${userId}`);
        await Rating.update({type: 'final'}, { where: { userId: userId, type: 'tmp' } });// change all current user ratings to final
    }

    static async saveOldRatings() {
        logger.info(`saveOldRatings - save all Ratings that have not been updated in the last 24 hours`);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const userIdsToSave = await Rating.findAll({
            attributes: ['userId'],
            where: {
                updatedAt: {
                    [Op.lt]: oneDayAgo
                },
                type: "tmp"
            },
            group: ['userId']
        });
        
        const savePromises = userIdsToSave.map(async (rating) => {
          await RatingRepository.saveRatings(rating.userId);
        });
      
        await Promise.all(savePromises);
    }

    static async getAllRatings() {
      try {
          const ratings = await Rating.findAll();
          let result = [];
          for (let rating of ratings) {
              const image = await Image.findOne({ where: { id: rating.imageId } });
              const category = await Category.findOne({ where: { id: image.categoryId } })
              result.push({
                imageId: rating.imageId, 
                imageName: image.imageName, 
                imageCategory: category.categoryName,
                userId: rating.userId,
                rating: rating.rating,
                type: rating.type,
                submittedFrom: rating.submittedFrom,
                updatedAt: rating.updatedAt
              });
          }
          return result;
      } catch (error) {
          throw new Error('Error fetching ratings ' + error);
      }
  }

  static async getAllRatingsPaginated(page=1, pageSize=20) {
    try {
        const ratings = await Rating.findAndCountAll({
            limit: pageSize,
            offset: (page - 1) * pageSize
        });
        let result = [];
        for (let rating of ratings.rows) {
            const image = await Image.findOne({ where: { id: rating.imageId } });
            const category = await Category.findOne({ where: { id: image.categoryId } })
            result.push({
              imageId: rating.imageId, 
              imageName: image.imageName, 
              imageCategory: category.categoryName,
              userId: rating.userId,
              rating: rating.rating,
              type: rating.type,
              submittedFrom: rating.submittedFrom,
              updatedAt: rating.updatedAt
            });
        }
        return { ratings: result, count: ratings.count };
    } catch (error) {
        throw new Error('Error fetching ratings');
    }
  }

  static async getImageRatings(imageId) {
    try {
      const ratings = await Rating.findAll({ where: { imageId } });
      let result = [];
      for (let rating of ratings) {
          const image = await Image.findOne({ where: { id: rating.imageId } });
          const category = await Category.findOne({ where: { id: image.categoryId } })
          result.push({
            imageId: rating.imageId, 
            imageName: image.imageName, 
            imageCategory: category.categoryName,
            userId: rating.userId,
            rating: rating.rating,
            type: rating.type,
            submittedFrom: rating.submittedFrom,
            updatedAt: rating.updatedAt
          });
      }
      return result;
    } catch (error) {
      logger.error(`ImageRepo - getAllImageRatings error ${error}`);
      throw new Error('Error fetching ratings');
    }
  }
  
  static async getAverageImageRating(imageId) {
    try {
      const ratings = await Rating.findAll({ where: { imageId } });
      if (ratings.length === 0) {
        return 0;
      }
      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      return sum / ratings.length;
    } catch (error) {
      throw new Error('Error fetching ratings');
    }
  }

  static async getAmountOfRatings(imageId) {
    try {
      const ratings = await Rating.findAll({ where: { imageId } });
      return ratings.length;
    } catch (error) {
      throw new Error('Error fetching ratings');
    }
  }

  static async getUserRatings(userId) {
    try {
      const ratings = await Rating.findAll({ where: { userId } });
      return ratings;
    } catch (error) {
      throw new Error('Error fetching ratings');
    }
  }

  static async deleteRatings(imageId) {
    try {
      await Rating.destroy({ where: { imageId } });
    } catch (error) {
      throw new Error('Error deleting rating');
    }
  }

}

module.exports = RatingRepository;