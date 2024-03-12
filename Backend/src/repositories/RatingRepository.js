const { FinalRating, TmpRating } = require("../Models");


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
        TmpRating.update({ rating: toBasket }, 
            { where: { email, imageId, rating: fromBasket} });
    }

    static async saveRatings(email) {
        const tmpRatings = await TmpRating.findAll({ where: { email } });

        tmpRatings.forEach((tmpRating) => {
            FinalRating.create({
                email: tmpRating.email,
                imageId: tmpRating.imageId,
                rating: tmpRating.rating,
            })
        });
        TmpRating.destroy({ where: { email } });
    }
}

module.exports = RatingRepository;