const { Image, Rating, Category } = require("../models");
const RatingRepository = require("./RatingRepository");
const UserRepository = require('../repositories/UserRepository');
const logger = require('../logger');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');




class ImageRepository {

    static async generateSmalllImages() {
      logger.info(`ImageRepo - generateSmalllImages func is running`);
      const categories = fs.readdirSync(path.join(__dirname, '../../images/original'));
      for (const category of categories) {
        const images = fs.readdirSync(path.join(__dirname, `../../images/original/${category}`));
        if (!fs.existsSync(path.join(__dirname, `../../images/small/${category}`))) {
          fs.mkdirSync(path.join(__dirname, `../../images/small/${category}`));
        }
        for (const imageName of images) {
          const resizedImagePath = path.join(__dirname, `../../images/small/${category}`, imageName);
          if (!fs.existsSync(resizedImagePath)) {
            await this.generateSmallImage(imageName, category);
          }
        }
      }
    }

    static async generateSmallImage(imageName, category){
      logger.info(`ImageRepo - generateSmallImage func is running for imageName: ${imageName} category: ${category}`);
      const imagePath = path.join(__dirname, `../../images/original/${category}`, imageName);
      const image = await fs.promises.readFile(imagePath);
      const resizedImage = await sharp(image).metadata()
      .then(({ width }) => sharp(image)
        .resize(Math.round(width * 0.5))
        .toBuffer()
      );
      const resizedImagePath = path.join(__dirname, `../../images/small/${category}`, imageName);
      await fs.promises.writeFile(resizedImagePath, resizedImage);
    }

    static async initializeImagesDB() {
      logger.info(`ImageRepo - initializeImagesDB func is running - initializing images`);
      const categories = await Category.findAll();
      for (const category of categories) {
        const images = fs.readdirSync(path.join(__dirname, `../../images/small/${category.categoryName}`));
        const categoryId = category.id;
        for (const imageName of images) {
          
          //check if image already exists
          const image = await Image.findOne({ where: { imageName, categoryId } });
          if (!image) {
            const imageId = uuidv4();
            const img = await Image.create({
              id: imageId,
              imageName: imageName,
              categoryId: categoryId
            });
          }
        }
      }
    }

    static async initializeCategoryDB() {
      logger.info(`ImageRepo - initializeCategoryDB func is running - initializing catrgories`);
      const categories = fs.readdirSync(path.join(__dirname, '../../images/original'));
      for (const categoryName of categories) {
        const category = await Category.findOne({ where: { categoryName } });
        if(!category){
          await Category.create({categoryName});
        }
      }
    }

    static async fetchImages(email) {
        try {
            const userId = await UserRepository.getUserId(email);
            const userTmpRatings = await Rating.findAll({ where: { userId: userId, type: "tmp" } });
            if (userTmpRatings.length === 0) {
              console.log("fetching new images");
              logger.info(`ImageRepo - fetchImages func is running - fetching new images`);
              const images = await ImageRepository.fetchNewImages(userId);
              return images;

            }
            else {
              console.log("fetching session images");
              logger.info(`ImageRepo - fetchImages func is running - fetching session images`);
              const images = await ImageRepository.fetchSessionImages(userId);
              return images;
            }
        } catch (error) {
            logger.error(`ImageRepo - fetchImages error ${error}`);
            throw new Error('Error fetching images');
        }
    }

    static async fetchNewImages(userId) {
        try {
            const allImages = await Image.findAll();
            const userRatedImages = await Rating.findAll({where: { userId, type: "final" }});
            //subtract rated images from all images
            const images = allImages.filter((image) => {
                return !userRatedImages.some((ratedImage) => {
                    return ratedImage.imageId === image.imageId;
                });
            });

            const totalNumOfImages = images.length;

            //select 70 images proportionally to the number of images in each category
            let selectedImages = [];
            const categories = await Category.findAll();
           
            //create an array of arrays, each array will contain the images of a category
            let categoryImagesArray = categories.map((category) => images.filter((image) => image.categoryId === category.id));
            categoryImagesArray = categoryImagesArray.map((category) => category.sort(() => Math.random() - 0.5)); //shuffle each category
            
            for (let i=0; i < categoryImagesArray.length; i++){
              const categoryImages = categoryImagesArray[i];
              const numOfImagesToSelect = Math.floor((categoryImages.length / totalNumOfImages) * 70);
              for (let j=0; j < numOfImagesToSelect; j++){
                selectedImages.push(categoryImages.pop());
              }
              categoryImagesArray[i] = categoryImages;
            }

            if (selectedImages.length < 70) {
              //if we didn't reach 70 images, select the rest randomly
              const restImages = categoryImagesArray.flat();
              restImages.sort(() => Math.random() - 0.5);
              for (let i=selectedImages.length; i < 70; i++){
                if (restImages.length === 0) {
                  throw new Error('Not enough images');
                }
                selectedImages.push(restImages.pop());
              }
            }

            //shuffle the whole list of images so that we mix the categories
            selectedImages.sort(() => Math.random() - 0.5); 

            //set the tmpRating of the selected images to 0
            RatingRepository.addInitialRatings(userId, selectedImages);


            // Using the image path, read the image and convert to base64
            const imagePromises = selectedImages.map(async (image) => {
              const category = await Category.findOne({ where: { id: image.categoryId } })
              const imagePath = path.join(__dirname, `../../images/small/${category.categoryName}`, image.imageName);
              const imageData = await fs.promises.readFile(imagePath, { encoding: 'base64' });
              return {imageId: image.id, imageData: imageData};
            });

            const result = await Promise.all(imagePromises);

            return result;
        } catch (error) {
            logger.error(`ImageRepo - fetchNewImages error ${error}`);
            throw new Error(`Error fetching images ${error}`);
        }
    }

    static async fetchImage(imageId) {
        try {
            const image = await Image.findOne({ where: { id: imageId } });
            const category = await Category.findOne({ where: { id: image.categoryId } })
            const imagePath = path.join(__dirname, `../../images/original/${category.categoryName}`, image.imageName);
            const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
            return {imageId: image.id, imageData: imageData};
        } catch (error) {
            logger.error(`ImageRepo - fetchImage error ${error} for imageId ${imageId}`);
            throw new Error('Error fetching image');
        }
    }

    static async fetchSessionImages(userId) {
        try {
            const userRatedImagesRatings = await Rating.findAll({ where: { userId, type: "tmp" } });
            const userRatedImages = await Promise.all(userRatedImagesRatings.map(async (rating) => {
              return await Image.findOne({ where: { id: rating.imageId } });
            }));

            const result = [];
            for (const image of userRatedImages) {
              const category = await Category.findOne({ where: { id: image.categoryId } })
              const imagePath = path.join(__dirname, `../../images/small/${category.categoryName}`, image.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
              const rating = userRatedImagesRatings.find((ratedImage) => ratedImage.imageId === image.id).rating;
              result.push({imageId: image.id, imageData: imageData, rating: rating});
            }

            return result;
        } catch (error) {
          logger.error(`ImageRepo - fetchSessionImages error ${error}`);
          throw new Error('Error fetching images');
        }
    }
}

module.exports = ImageRepository;