const RatingRepository = require('../repositories/RatingRepository');
const logger = require('../logger');

class RatingController {

    async changeRating(req, res) {

        const {email , imageId, fromBasket , toBasket} = req.body
        logger.info(`RatingController - changeRating request by ${email} imageId: ${imageId} fromBasket: ${fromBasket} toBasket: ${toBasket}`);
        try {
            const rating = await RatingRepository.changeRating(email, imageId, fromBasket, toBasket);
            res.status(200).json({ message: 'Rating added successfully', rating });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - changeRating error message ${error.message}`);
        }
    }

    async saveRatings(req, res) {

        const {username} = req.body
        logger.info(`RatingController - saveRatings request by ${username}`);
        try {
            await RatingRepository.saveRatings(username);
            res.status(200).json({ message: 'Ratings saved successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - saveRatings error message ${error.message}`);
        }
    }
}

module.exports = new RatingController();
