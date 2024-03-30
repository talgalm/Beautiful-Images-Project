const { FinalRating, TmpRating } = require("../models");
const { Op } = require("sequelize");

class RatingRepository {
    static async addInitialRatings(email, images) {
        const ratings = images.map((image) => {
            return {
                imageId: image.id,
                email,
                rating: 0,
                submittedFrom: 'initial',
                updatedAt: new Date().toISOString().substring(0, 19).replace('T', ' ')
            };
        });
        await TmpRating.bulkCreate(ratings);
    }

    static async changeRating(email, imageId, fromBasket, toBasket) {
        const rating = await TmpRating.findOne(
            { where: { email, imageId, rating: fromBasket } });
        if (!rating) {
            throw new Error('Rating not found');
        }
        await TmpRating.update({ rating: toBasket }, 
            { where: { email, imageId, rating: fromBasket} });
    }

    static async saveRatings(email) {
        const tmpRatings = await TmpRating.findAll({ where: { email } });

        tmpRatings.forEach(async (tmpRating) => {
            await FinalRating.create({
                email: tmpRating.email,
                imageId: tmpRating.imageId,
                rating: tmpRating.rating,
            })
        });
        await TmpRating.destroy({ where: { email } });
    }

    static async saveOldRatings() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const emailsToSave = await TmpRating.findAll({
            attributes: ['email'],
            where: {
            updatedAt: {
                [Op.lt]: oneDayAgo
            }
            },
            group: ['email']
        });

        emailsToSave.forEach(async (email) => {
            await RatingRepository.saveRatings(email.email);
        });

    }
}

module.exports = RatingRepository;