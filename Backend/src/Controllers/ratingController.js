const RatingRepository = require('../repositories/RatingRepository');

class RatingController {
    async changeRating(req, res) {
        const {email , imageId, fromBasket , toBasket} = req.body
        console.log(req.body)
        try {
            const rating = await RatingRepository.changeRating(email, imageId, fromBasket, toBasket);
            res.status(200).json({ message: 'Rating added successfully', rating });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async saveRatings(req, res) {
        const {username} = req.body
        console.log(req.body)
        try {
            await RatingRepository.saveRatings(username);
            res.status(200).json({ message: 'Ratings saved successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new RatingController();
