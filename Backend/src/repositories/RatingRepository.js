const rating = require("../Models/rating");
const { FinalRating, Rating } = require("../models");
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
}

module.exports = RatingRepository;