const FinalRating = require("../Models/finalRatingModel");
const TmpRating = require("../Models/tmpRatingModel");

class RatingRepository {
    static async addInitialRatings(username, images) {
        const ratings = images.map((image) => {
            return {
                username,
                imageName: image.imageName,
                rating: 0,
                updatedAt: new Date().getTime().toString()
            };
        });
        TmpRating.bulkCreate(ratings);
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
        const FinalRating = tmpRatings.map((tmpRating) => {
            return {
                username: tmpRating.username,
                imageName: tmpRating.imageName,
                rating: tmpRating.rating,
            };
        });
        FinalRating.bulkCreate(FinalRating);
        tmpRatings.destroy({ where: { username } });
    }
}

module.exports = RatingRepository;