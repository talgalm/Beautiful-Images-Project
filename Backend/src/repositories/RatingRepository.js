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

    static async changeRating(username, fileName, fromBasket, toBasket) {
        const rating = await TmpRating.findOne(
            { where: { username, imageName: fileName, rating: fromBasket } });
        if (!rating) {
            throw new Error('Rating not found');
        }
        TmpRating.update({ rating: toBasket }, 
            { where: { username, imageName: fileName, rating: fromBasket } });
    }

    static async saveRatings(username) {
        const tmpRatings = await TmpRating.find({ username });
        const finalRatings = tmpRatings.map((tmpRating) => {
            return {
                username: tmpRating.username,
                imageName: tmpRating.imageName,
                rating: tmpRating.rating,
            };
        });
        FinalRating.bulkCreate(finalRatings);
        tmpRatings.destroy({ where: { username } });
    }
}

module.exports = RatingRepository;