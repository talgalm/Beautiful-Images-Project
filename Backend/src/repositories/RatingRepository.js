const { Rating, Image, Category } = require("../models");
const { Op } = require("sequelize");

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

    static async changeRating(userId, imageId, fromBasket, toBasket) {
        const rating = await Rating.findOne(
            { where: { userId, imageId, rating: fromBasket, type: "tmp" } });
        if (!rating) {
            throw new Error('Rating not found');
        }
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (rating.createdAt < oneDayAgo) {
            throw new Error('Rating is older than 24 hours');
        }
        await Rating.update({ rating: toBasket }, 
            { where: { userId, imageId, rating: fromBasket} });
    }

    static async saveRatings(userId) {
        //await Rating.destroy( {where: { userId, type: "tmp", rating: 0 }}); //remove images with rating 0 from the table
        await Rating.update({type: "final"}, { where: { userId, type: "tmp" } });// change all current user ratings to final
    }

    static async saveOldRatings() {
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

        userIdsToSave.forEach(async (rating) => {
            await RatingRepository.saveRatings(rating.userId);
        });

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
      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      return sum / ratings.length;
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
}

module.exports = RatingRepository;