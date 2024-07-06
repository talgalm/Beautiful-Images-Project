const AdminController = require('../Controllers/AdminController');
const UserRepository = require('../repositories/UserRepository');
const RatingRepository = require('../repositories/RatingRepository');
const ImageRepository = require('../repositories/ImageRepository');
const AdminRepository = require('../repositories/AdminRepository');
const { generateAccessToken } = require('../tokens/tokens');

jest.mock('../repositories/UserRepository');
jest.mock('../repositories/RatingRepository');
jest.mock('../repositories/ImageRepository');
jest.mock('../repositories/AdminRepository');
jest.mock('../tokens/tokens');

describe('AdminController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      download: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('adminLogin', () => {
    it('should return a token on successful login', async () => {
      req.body = { email: 'admin@example.com', password: 'password' };
      UserRepository.authenticateAdmin.mockResolvedValue();
      generateAccessToken.mockReturnValue('token');

      await AdminController.adminLogin(req, res);

      expect(UserRepository.authenticateAdmin).toHaveBeenCalledWith('admin@example.com', 'password');
      expect(generateAccessToken).toHaveBeenCalledWith('admin@example.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', token: 'token' });
    });

    it('should return an error message on failed login', async () => {
      req.body = { email: 'admin@example.com', password: 'wrongpassword' };
      const error = new Error('Invalid credentials');
      UserRepository.authenticateAdmin.mockRejectedValue(error);

      await AdminController.adminLogin(req, res);

      expect(UserRepository.authenticateAdmin).toHaveBeenCalledWith('admin@example.com', 'wrongpassword');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
  });

  describe('allRatings', () => {
    it('should return all ratings', async () => {
      req.body = { email: 'admin@example.com' };
      const ratings = [{ rating: 5 }];
      RatingRepository.getAllRatings.mockResolvedValue(ratings);

      await AdminController.allRatings(req, res);

      expect(RatingRepository.getAllRatings).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return an error message if fetching ratings fails', async () => {
      req.body = { email: 'admin@example.com' };
      const error = new Error('Failed to fetch ratings');
      RatingRepository.getAllRatings.mockRejectedValue(error);

      await AdminController.allRatings(req, res);

      expect(RatingRepository.getAllRatings).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch ratings' });
    });
  });

  describe('userRatings', () => {
    it('should return user ratings', async () => {
      req.body = { email: 'admin@example.com', userId: 'user1' };
      const ratings = [{ rating: 5 }];
      RatingRepository.getUserRatings.mockResolvedValue(ratings);

      await AdminController.userRatings(req, res);

      expect(RatingRepository.getUserRatings).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return an error message if fetching user ratings fails', async () => {
      req.body = { email: 'admin@example.com', userId: 'user1' };
      const error = new Error('Failed to fetch user ratings');
      RatingRepository.getUserRatings.mockRejectedValue(error);

      await AdminController.userRatings(req, res);

      expect(RatingRepository.getUserRatings).toHaveBeenCalledWith('user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch user ratings' });
    });
  });

  describe('imageRatings', () => {
    it('should return image ratings', async () => {
      req.body = { email: 'admin@example.com', imageId: 'image1' };
      const ratings = [{ rating: 5 }];
      RatingRepository.getImageRatings.mockResolvedValue(ratings);

      await AdminController.imageRatings(req, res);

      expect(RatingRepository.getImageRatings).toHaveBeenCalledWith('image1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return an error message if fetching image ratings fails', async () => {
      req.body = { email: 'admin@example.com', imageId: 'image1' };
      const error = new Error('Failed to fetch image ratings');
      RatingRepository.getImageRatings.mockRejectedValue(error);

      await AdminController.imageRatings(req, res);

      expect(RatingRepository.getImageRatings).toHaveBeenCalledWith('image1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch image ratings' });
    });
  });

  describe('getAllImages', () => {
    it('should return all images', async () => {
      req.body = { email: 'admin@example.com' };
      const images = [{ imageId: 'image1' }];
      ImageRepository.getAllImages.mockResolvedValue(images);

      await AdminController.getAllImages(req, res);

      expect(ImageRepository.getAllImages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ images });
    });

    it('should return an error message if fetching images fails', async () => {
      req.body = { email: 'admin@example.com' };
      const error = new Error('Failed to fetch images');
      ImageRepository.getAllImages.mockRejectedValue(error);

      await AdminController.getAllImages(req, res);

      expect(ImageRepository.getAllImages).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch images' });
    });
  });

  describe('generateAndFetchPdfReport', () => {
    it('should return an error message if generating the PDF report fails', async () => {
      req.body = { email: 'admin@example.com' };
      const error = new Error('Failed to generate PDF report');
      AdminRepository.generatePdfReport.mockRejectedValue(error);

      await AdminController.generateAndFetchPdfReport(req, res);

      expect(AdminRepository.generatePdfReport).toHaveBeenCalledWith('admin@example.com');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to generate PDF report' });
    });
  });

});
