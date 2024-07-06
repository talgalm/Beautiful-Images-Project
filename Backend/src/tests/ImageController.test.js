const ImageController = require('../Controllers/ImageController');
const ImageRepository = require('../repositories/ImageRepository');
const logger = require('../logger');
const { Category } = require("../Models");

jest.mock('../repositories/ImageRepository');

describe('ImageController', () => {
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

  describe('fetchImages', () => {
    it('should return images on successful fetch', async () => {
      const email = 'test@example.com';
      const images = [{ id: 1, name: 'Image 1' }];
      ImageRepository.fetchImages.mockResolvedValue(images);

      req.body.email = email;
      await ImageController.fetchImages(req, res);

      expect(ImageRepository.fetchImages).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ images });
    });

    it('should return error message on fetch failure', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Failed to fetch images';
      ImageRepository.fetchImages.mockRejectedValue(new Error(errorMessage));

      req.body.email = email;
      await ImageController.fetchImages(req, res);

      expect(ImageRepository.fetchImages).toHaveBeenCalledWith(email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('fetchImage', () => {
    it('should return image details on successful fetch', async () => {
      const imageId = 'image1';
      const image = { id: imageId, name: 'Image 1' };
      ImageRepository.fetchImage.mockResolvedValue(image);

      req.body.imageId = imageId;
      await ImageController.fetchImage(req, res);

      expect(ImageRepository.fetchImage).toHaveBeenCalledWith(imageId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ image });
    });

    it('should return error message on fetch failure', async () => {
      const imageId = 'image1';
      const errorMessage = 'Failed to fetch image';
      ImageRepository.fetchImage.mockRejectedValue(new Error(errorMessage));

      req.body.imageId = imageId;
      await ImageController.fetchImage(req, res);

      expect(ImageRepository.fetchImage).toHaveBeenCalledWith(imageId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('fetchCategories', () => {
    it('should return categories on successful fetch', async () => {
      const categories = ['Nature', 'City'];
      ImageRepository.fetchCategories.mockResolvedValue(categories);

      await ImageController.fetchCategories(req, res);

      expect(ImageRepository.fetchCategories).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ categories });
    });

    it('should return error message on fetch failure', async () => {
      const errorMessage = 'Failed to fetch categories';
      ImageRepository.fetchCategories.mockRejectedValue(new Error(errorMessage));

      await ImageController.fetchCategories(req, res);

      expect(ImageRepository.fetchCategories).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('createImage', () => {
    it('should create an image on successful creation', async () => {
      const categoryName = 'test-category';
      const imageData = { email:"test@mail.com", imageName: 'Image 1', categoryName: categoryName, imageData: 'base64image' };
      const createdImage = { id: 'image1', name: 'Image 1', categoryId: 1 };
      const category = {
        id: 1,
        categoryName: categoryName
      };
      ImageRepository.createImage.mockResolvedValue(createdImage);
      jest.spyOn(Category, 'findOne').mockResolvedValue(category);
      req.body = imageData;

      await ImageController.createImage(req, res);

      expect(ImageRepository.createImage).toHaveBeenCalledWith(imageData.email, imageData.imageName, imageData.categoryName, imageData.imageData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ image: createdImage });
    });

    it('should return error message on creation failure', async () => {
      const imageData = { email: 'test@example.com', imageName: 'Image 1', categoryName: 'Nature', imageData: 'base64image' };
      const errorMessage = 'Failed to create image';
      ImageRepository.createImage.mockRejectedValue(new Error(errorMessage));

      req.body = imageData;
      await ImageController.createImage(req, res);

      expect(ImageRepository.createImage).toHaveBeenCalledWith(imageData.email, imageData.imageName, imageData.categoryName, imageData.imageData);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('deleteImage', () => {
    it('should delete an image on successful deletion', async () => {
      const imageId = 'image1';
      const deletedImage = { id: imageId, name: 'Image 1' };
      ImageRepository.deleteImage.mockResolvedValue(deletedImage);

      req.body = { email: 'test@example.com', imageId };
      await ImageController.deleteImage(req, res);

      expect(ImageRepository.deleteImage).toHaveBeenCalledWith(imageId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ image: deletedImage });
    });

    it('should return error message on deletion failure', async () => {
      const imageId = 'image1';
      const errorMessage = 'Failed to delete image';
      ImageRepository.deleteImage.mockRejectedValue(new Error(errorMessage));

      req.body = { email: 'test@example.com', imageId };
      await ImageController.deleteImage(req, res);

      expect(ImageRepository.deleteImage).toHaveBeenCalledWith(imageId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('updateImage', () => {
    it('should update an image on successful update', async () => {
      const imageId = 'image1';
      const updatedImage = { id: imageId, imageName: 'Updated Image 1', category: 'City' };
      ImageRepository.updateImage.mockResolvedValue(updatedImage);

      req.body = { email: 'test@example.com', imageId, imageName: 'Updated Image 1', categoryName: 'City' };
      await ImageController.updateImage(req, res);

      expect(ImageRepository.updateImage).toHaveBeenCalledWith(updatedImage.id, updatedImage.imageName, updatedImage.category);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ image: updatedImage });
    });

    it('should return error message on update failure', async () => {
      const imageId = 'image1';
      const errorMessage = 'Failed to update image';
      ImageRepository.updateImage.mockRejectedValue(new Error(errorMessage));

      req.body = { email: 'test@example.com', imageId, imageName: 'Updated Image 1', categoryName: 'City' };
      await ImageController.updateImage(req, res);

      expect(ImageRepository.updateImage).toHaveBeenCalledWith(imageId, 'Updated Image 1', 'City');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getImageRatingsDistribution', () => {
    it('should return image ratings distribution on successful fetch', async () => {
      const imageId = 'image1';
      const ratings = { 5: 10, 4: 5, 3: 3 };
      ImageRepository.getImageRatingsDistribution.mockResolvedValue(ratings);

      req.body = { email: 'test@example.com', imageId };
      await ImageController.getImageRatingsDistribution(req, res);

      expect(ImageRepository.getImageRatingsDistribution).toHaveBeenCalledWith(imageId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ratings });
    });

    it('should return error message on fetch failure', async () => {
      const imageId = 'image1';
      const errorMessage = 'Failed to fetch image ratings distribution';
      ImageRepository.getImageRatingsDistribution.mockRejectedValue(new Error(errorMessage));

      req.body = { email: 'test@example.com', imageId };
      await ImageController.getImageRatingsDistribution(req, res);

      expect(ImageRepository.getImageRatingsDistribution).toHaveBeenCalledWith(imageId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

});

