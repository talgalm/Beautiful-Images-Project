const RatingController = require('../Controllers/ratingController');
const RatingRepository = require('../repositories/RatingRepository');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../logger');

jest.mock('../repositories/RatingRepository');
jest.mock('../repositories/UserRepository');
jest.mock('../logger');

describe('RatingController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('changeRating', () => {
    it('should change rating successfully', async () => {
      const email = 'test@example.com';
      const userId = 'user1';
      const imageId = 'image1';
      const fromBasket = false;
      const toBasket = true;
      const submittedFrom = 'web';

      req.body = { email, imageId, fromBasket, toBasket, submittedFrom };
      UserRepository.getUserId.mockResolvedValue(userId);
      RatingRepository.changeRating.mockResolvedValue({ rating: 5 });

      await RatingController.changeRating(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(RatingRepository.changeRating).toHaveBeenCalledWith(userId, imageId, fromBasket, toBasket, submittedFrom);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Rating added successfully', rating: { rating: 5 } });
    });

    it('should return error message on change rating failure', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Failed to change rating';

      req.body = { email };
      UserRepository.getUserId.mockRejectedValue(new Error(errorMessage));

      await RatingController.changeRating(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('saveRatings', () => {
    it('should save ratings successfully', async () => {
      const email = 'test@example.com';
      const userId = 'user1';

      req.body = { email };
      UserRepository.getUserId.mockResolvedValue(userId);
      RatingRepository.saveRatings.mockResolvedValue();

      await RatingController.saveRatings(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(RatingRepository.saveRatings).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ratings saved successfully', flag: true });
    });

    it('should return error message on save ratings failure', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Failed to save ratings';

      req.body = { email };
      UserRepository.getUserId.mockRejectedValue(new Error(errorMessage));

      await RatingController.saveRatings(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage, flag: false });
    });
  });

  describe('getAllRatings', () => {
    it('should get all ratings successfully', async () => {
      const ratings = [{ id: 1, rating: 5 }, { id: 2, rating: 4 }];

      RatingRepository.getAllRatings.mockResolvedValue(ratings);

      await RatingController.getAllRatings(req, res);

      expect(RatingRepository.getAllRatings).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return error message on get all ratings failure', async () => {
      const errorMessage = 'Failed to get all ratings';

      RatingRepository.getAllRatings.mockRejectedValue(new Error(errorMessage));

      await RatingController.getAllRatings(req, res);

      expect(RatingRepository.getAllRatings).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getUserRatings', () => {
    it('should get user ratings successfully', async () => {
      const email = 'test@example.com';
      const userId = 'user1';
      const ratings = [{ id: 1, rating: 5 }, { id: 2, rating: 4 }];

      req.body = { email };
      UserRepository.getUserId.mockResolvedValue(userId);
      RatingRepository.getUserRatings.mockResolvedValue(ratings);

      await RatingController.getUserRatings(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(RatingRepository.getUserRatings).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return error message on get user ratings failure', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Failed to get user ratings';

      req.body = { email };
      UserRepository.getUserId.mockRejectedValue(new Error(errorMessage));

      await RatingController.getUserRatings(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getImageRatings', () => {
    it('should get image ratings successfully', async () => {
      const email = 'test@example.com';
      const userId = 'user1';
      const ratings = [{ id: 1, rating: 5 }, { id: 2, rating: 4 }];

      req.body = { email };
      UserRepository.getUserId.mockResolvedValue(userId);
      RatingRepository.getImageRatings.mockResolvedValue(ratings);

      await RatingController.getImageRatings(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(RatingRepository.getImageRatings).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return error message on get image ratings failure', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Failed to get image ratings';

      req.body = { email };
      UserRepository.getUserId.mockRejectedValue(new Error(errorMessage));

      await RatingController.getImageRatings(req, res);

      expect(UserRepository.getUserId).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

});

