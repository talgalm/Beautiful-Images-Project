const { FinalRating, Rating } = require("../models");
const { Op } = require("sequelize");

class RatingRepository {
    static async addInitialRatings(email, images) {
        console.log('images: ', images.length);
        let ids = images.map((image) => image.id);
        ids.sort();
        console.log('ids: ', ids);
        await Promise.all(images.map(async (image) => {
            console.log('adding initial rating for image: ', image.id, ' email: ', email);
            await Rating.create({
                imageId: image.id,
                email,
                rating: 0,
                type: "tmp",
                submittedFrom: 'initial',
                updatedAt: new Date().toISOString().substring(0, 19).replace('T', ' ')
            });
        }));
    }

    static async changeRating(email, imageId, fromBasket, toBasket) {
        const rating = await Rating.findOne(
            { where: { email, imageId, rating: fromBasket, type: "tmp" } });
        if (!rating) {
            throw new Error('Rating not found');
        }
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (rating.createdAt < oneDayAgo) {
            throw new Error('Rating is older than 24 hours');
        }
        await Rating.update({ rating: toBasket }, 
            { where: { email, imageId, rating: fromBasket} });
    }

    static async saveRatings(email) {
        const tmpRatings = await Rating.findAll({ where: { email, type: "tmp" } });

        await tmpRatings.forEach(async (tmpRating) => {
            tmpRating.type = "final";
        });
        
    }

    static async saveOldRatings() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const emailsToSave = await Rating.findAll({
            attributes: ['email'],
            where: {
                updatedAt: {
                    [Op.lt]: oneDayAgo
                },
                type: "final"
            },
            group: ['email']
        });

        emailsToSave.forEach(async (email) => {
            await RatingRepository.saveRatings(email.email);
        });

    }
}

module.exports = RatingRepository;