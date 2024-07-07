const { Image, Rating, Category } = require("../Models");
const RatingRepository = require("./RatingRepository");
const UserRepository = require('../repositories/UserRepository');
const logger = require('../logger');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

class ImageRepository {

    static async generateSmallScaleImages() {
      logger.info(`ImageRepo - generateSmallScaleImages func is running`);
      const factors = [0.5, 0.25, 0.1];
      for (const factor of factors) {
        await this.generateSmallImages(factor);
      }
    }

    static async generateSmallImages(factor) {
      logger.info(`ImageRepo - generateSmallImages func is running`);
      const IMAGES_PATH = path.join(__dirname, '../../images');
      const categories = fs.readdirSync(`${IMAGES_PATH}/original`);
      for (const category of categories) {
        const images = fs.readdirSync(`${IMAGES_PATH}/original/${category}`);
        if (!fs.existsSync(`${IMAGES_PATH}/_${factor*100}`)) {
          fs.mkdirSync(`${IMAGES_PATH}/_${factor*100}`);
        }
        if (!fs.existsSync(`${IMAGES_PATH}/_${factor*100}/${category}`)) {
          fs.mkdirSync(`${IMAGES_PATH}/_${factor*100}/${category}`);
        }
        for (const imageName of images) {
          const resizedImagePath = path.join(`${IMAGES_PATH}/_${factor*100}/${category}/${imageName}`);
          if (!fs.existsSync(resizedImagePath)) {
            await this.generateSmallImage(imageName, category, factor);
          }
        }
      }
    }

    static async generateSmallImage(imageName, category, factor){
      logger.info(`ImageRepo - generateSmallImage func is running for imageName: ${imageName} category: ${category} factor: ${factor}`);
      const imagePath = path.join(__dirname, `../../images/original/${category}`, imageName);
      const image = await fs.promises.readFile(imagePath);
      const resizedImage = await sharp(image).metadata()
      .then(({ width }) => sharp(image)
        .resize(Math.round(width * factor))
        .toBuffer()
      );
      const resizedImagePath = path.join(__dirname, `../../images/_${factor*100}/${category}`, imageName);
      await fs.promises.writeFile(resizedImagePath, resizedImage);
    }

    static async initializeImagesDB() {
      logger.info(`ImageRepo - initializeImagesDB func is running - initializing images`);
      const categories = await Category.findAll();
      for (const category of categories) {
        const images = fs.readdirSync(path.join(__dirname, `../../images/_50/${category.categoryName}`));
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
              const processedImages = images.map(image => ({
                ...image,
                visible: image.rating ? image.rating === 0 : true
              }));
              console.log("---------------------------")
              console.log(processedImages)
              return processedImages;
            }
            else {
              console.log("fetching session images");
              logger.info(`ImageRepo - fetchImages func is running - fetching session images`);
              const images = await ImageRepository.fetchSessionImages(userId);
              const processedImages = images.map(image => ({
                ...image,
                visible: image.rating ? image.rating === 0 : true
              }));
              console.log("---------------------------")
              console.log(processedImages)
              return processedImages;
            }
        } catch (error) {
            logger.error(`ImageRepo - fetchImages error ${error}`);
            throw new Error('Error fetching images');
        }
    }

    static async fetchNewImagesForUser(userId) { 

        const allImages = await Image.findAll();
        const userRatedImages = await Rating.findAll({where: { userId, type: "final" }});
        const userRatedImagesIds = userRatedImages.map((rating)=>rating.imageId);
        //subtract rated images from all images
        const images = allImages.filter(image => !userRatedImagesIds.includes(image.id));
        return images;
    }

    static async fetchNewImages(userId) {
        try {
            const images = await ImageRepository.fetchNewImagesForUser(userId);
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
              const imagePath = path.join(__dirname, `../../images/_50/${category.categoryName}`, image.imageName);
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
              const imagePath = path.join(__dirname, `../../images/_50/${category.categoryName}`, image.imageName);
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

    static async getAllImages() {
        try {
            const images = await Image.findAll();
            let result = [];
            for (const image of images) {
              const category = await Category.findOne({ where: { id: image.categoryId } })
              const imagePath = path.join(__dirname, `../../images/_10/${category.categoryName}`, image.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
              const totalRatingsOfImage = await RatingRepository.getAmountOfRatings(image.id);
              const averageRatingOfImage = await RatingRepository.getAverageImageRating(image.id) || 0;
              result.push({
                id: image.id, 
                imageName: image.imageName, 
                imageCategory: category.categoryName, 
                imageData: imageData,
                totalRatings: totalRatingsOfImage,
                averageRating: averageRatingOfImage
              });
            }
            return result;
        } catch (error) {
            logger.error(`ImageRepo - getAllImages error ${error}`);
            throw new Error('Error fetching images');
        }
    }

    static async doesUserHaveRatedImages(userId) {
      try {
        const userRatedImages = await Rating.findAll({ where: { userId, type: "final" } });
        return userRatedImages.length > 0;
      } catch (error) {
        logger.error(`ImageRepo - doesUserHaveRatedImages error ${error}`);
        throw new Error('Error checking if user has rated images');
      }
    }

    static async getRatedImages(userId) {
      try {
        const userRatedImagesRatings = await Rating.findAll({ where: { userId, type: "final" } });
        const userRatedImages = await Promise.all(userRatedImagesRatings.map(async (rating) => {
          return await Image.findOne({ where: { id: rating.imageId } });
        }));

        const result = [];
        for (const image of userRatedImages) {
          const category = await Category.findOne({ where: { id: image.categoryId } })
          const imagePath = path.join(__dirname, `../../images/_50/${category.categoryName}`, image.imageName);
          const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
          const rating = userRatedImagesRatings.find((ratedImage) => ratedImage.imageId === image.id).rating;
          result.push({imageId: image.id, imageData: imageData, rating: rating});
        }

        return result;
      } catch (error) {
        logger.error(`ImageRepo - getRatedImages error ${error}`);
        throw new Error('Error fetching images');
      }
    }

    static async fetchCategories() {
        try {
            const categories = await Category.findAll();
            return categories;
        } catch (error) {
            logger.error(`ImageRepo - fetchCategories error ${error}`);
            throw new Error('Error fetching categories');
        }
    }

    static async createImage(imageName, categoryName, imageData) {
      try {
        let category = await Category.findOne({ where: { categoryName } });
        if (!category) {
          category = Category.create({ categoryName });
        }
        const imageId = uuidv4();
        const img = await Image.create({
          id: imageId,
          imageName: imageName,
          categoryId: category.id
        });
        const imagePath = path.join(__dirname, `../../images/original/${categoryName}`, imageName);
        await fs.promises.writeFile(imagePath, imageData, { encoding: 'base64' });
        this.generateSmallScaleImages();
        return img;
      } catch (error) {
        logger.error(`ImageRepo - addImage error ${error}`);
        throw new Error('Error adding image');
      }
    }

    static async deleteImage(imageId) {
      try {
        const image = await Image.findOne({ where: { id: imageId } });
        const category = await Category.findOne({ where: { id: image.categoryId } });
        //delete images files
        const sizes = ["original", "_50", "_25", "_10"];
        for (const size of sizes) {
          const imagePath = path.join(__dirname, `../../images/${size}/${category.categoryName}`, image.imageName);
          await fs.promises.unlink(imagePath);
        }
        //delete image from db
        await image.destroy();

        //check if the category is empty and delete it
        const imagesInCategory = await Image.findAll({ where: { categoryId: category.id } });
        if (imagesInCategory.length === 0) {
          await category.destroy();
        }

        //delete ratings with the image id from db
        await RatingRepository.deleteRatings(imageId);
      } catch (error) {
        logger.error(`ImageRepo - deleteImage error ${error}`);
        throw new Error('Error deleting image');
      }
    }

    static async updateImage(imageId, imageName, categoryName) {
      try {
        const image = await Image.findOne({ where: { id: imageId } });
        const oldCategory = await Category.findOne({ where: { id: image.categoryId } });
        const imageData = fs.readFileSync(path.join(__dirname, `../../images/original/${oldCategory.categoryName}`, image.imageName), { encoding: 'base64' });
        
        //delete images files
        const sizes = ["original", "_50", "_25", "_10"];
        for (const size of sizes) {
          const imagePath = path.join(__dirname, `../../images/${size}/${oldCategory.categoryName}`, image.imageName);
          await fs.promises.unlink(imagePath);
        }

        let category = await Category.findOne({ where: { categoryName } });
        if (!category) {
          category = Category.create({ categoryName });
          //create the category folder
          fs.mkdirSync(path.join(__dirname, `../../images/original/${categoryName}`));
        }
        image.imageName = imageName;
        image.categoryId = category.id;

        const imagePath = path.join(__dirname, `../../images/original/${categoryName}`, imageName);
        await fs.promises.writeFile(imagePath, imageData, { encoding: 'base64' });
        this.generateSmallScaleImages();
      
        await image.save();
      } catch (error) {
        logger.error(`ImageRepo - updateImage error ${error}`);
        throw new Error('Error updating image');
      }
    }

    static async getImageRatingsDistribution(imageId) {
      try {
        const ratings = await Rating.findAll({ where: { imageId } });
        const distribution = Array(11).fill(0);
        for (const rating of ratings) {
          distribution[rating.rating]++;
        }
        return distribution;
      } catch (error) {
        logger.error(`ImageRepo - getImageRatingDistribution error ${error}`);
        throw new Error('Error fetching ratings');
      }
    }
}

module.exports = ImageRepository;