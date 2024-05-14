const RatingRepository = require('../repositories/RatingRepository');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../logger');

class RatingController {

    async changeRating(req, res) {
        const {email , imageId, fromBasket , toBasket} = req.body
        logger.info(`RatingController - changeRating request by ${email} imageId: ${imageId} fromBasket: ${fromBasket} toBasket: ${toBasket}`);
        try {
            const userId = await UserRepository.getUserId(email);
            const rating = await RatingRepository.changeRating(userId, imageId, fromBasket, toBasket);
            res.status(200).json({ message: 'Rating added successfully', rating });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - changeRating error message ${error.message}`);
        }
    }

    async saveRatings(req, res) {
        const {email} = req.body
        logger.info(`RatingController - saveRatings request by ${email}`);
        try {
            const userId = await UserRepository.getUserId(email);
            await RatingRepository.saveRatings(userId);
            res.status(200).json({ message: 'Ratings saved successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - saveRatings error message ${error.message}`);
        }
    }

    //TODO - add checks that only admin can call these functions
    async getAllRatings(req, res) {
        const {email} = req.body
        logger.info(`RatingController - getAllRatings request by ${email}`);
        try {
            const ratings = await RatingRepository.getAllRatings();
            res.status(200).json({ ratings });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - getAllRatings error message ${error.message}`);
        }
    }

    async getUserRatings(req, res) {
        const {email} = req.body
        logger.info(`RatingController - getUserRatings request by ${email}`);
        try {
            const userId = await UserRepository.getUserId(email);
            const ratings = await RatingRepository.getUserRatings(userId);
            res.status(200).json({ ratings });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - getUserRatings error message ${error.message}`);
        }
    }

    async getImageRatings(req, res) {
        const {email} = req.body
        logger.info(`RatingController - getAllImageRatings request by ${email}`);
        try {
            const userId = await UserRepository.getUserId(email);
            const ratings = await RatingRepository.getImageRatings(userId);
            res.status(200).json({ ratings });
        } catch (error) {
            res.status(400).json({ message: error.message });
            logger.error(`RatingController - getAllImageRatings error message ${error.message}`);
        }
    }
}

module.exports = new RatingController();
