class RatingController {
    addRating(req, res) {
        const {username , fromBasket , fileName , toBasket} = req.body
        console.log(req.body)
    }
}

module.exports = new RatingController();
