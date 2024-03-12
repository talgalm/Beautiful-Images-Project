const { Image, FinalRating, TmpRating } = require("../Models");
const RatingRepository = require("./RatingRepository");

const fs = require('fs');
const path = require('path');


class ImageRepository {

    static async initializeImagesDB() {
      console.log("initializing images");
      const categories = fs.readdirSync(path.join(__dirname, '../../images'));
      for (const category of categories) {
        const images = fs.readdirSync(path.join(__dirname, `../../images/${category}`));

        for (const imageName of images) {
          const imageId = generateImageId();
          
          //check if image already exists
        
          const img = await Image.create({
            id: imageId,
            imageName: imageName,
            category: category
          });
        }
      }

      function generateImageId() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let imageId = '';
        for (let i = 0; i < 10; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          imageId += characters[randomIndex];
        }
        return imageId;
      }
    }

    static async fetchNewImages(email) {
        try {
            console.log("fetching new images");
            const allImages = await Image.findAll();
            const userRatedImages = await FinalRating.findAll({where: { email: email }});
            //subtract rated images from all images\
            const images = allImages.filter((image) => {
                return !userRatedImages.some((ratedImage) => {
                    return ratedImage.imageId === image.imageId;
                });
            });

            //select 60 images evenly from all categories
            const selectedImages = [];
            const categories = [...new Set(images.map((image) => image.category))];
            const imagesPerCategory = Math.ceil(60 / categories.length);

            categories.forEach((category) => {
              const categoryImages = images.filter((image) => image.category === category);
              const selectedCategoryImages = categoryImages.slice(0, imagesPerCategory);
              selectedImages.push(...selectedCategoryImages);
            });

            //set the tmpRating of the selected images to 0
            //RatingRepository.addInitialRatings(email, selectedImages);

            //using the image path, read the image and convert to base64
            selectedImages.forEach((image) => {
              const imagePath = path.join(__dirname, `../../images/${image.category}`, image.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
              image.imageData = imageData;
            });

            const result = [];
            selectedImages.forEach((image) => {
              result.push({imageId: image.id, imageData: image.imageData});
            });

            console.log(result.slice(0, 5));
            
            return result;
        } catch (error) {
            throw new Error('Error fetching images');
        }
    }

    static async fetchImage(email, imageId) {
        try {
            //TODO: validate email

            const image = await Image.findOne({ where: { imageId } });
            const imagePath = path.join(__dirname, `../../images/${image.category}`, image.imageName);
            const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
            image.imageData = imageData;
            return image;
        } catch (error) {
            throw new Error('Error fetching image');
        }
    }

    static async fetchSessionImages(email) {
        try {
            const userRatedImages = await TmpRating.findAll({ where: { email : email } });
            //return array of {image, rating}

            const images = userRatedImages.map((ratedImage) => {
              const imagePath = path.join(__dirname, `../../images/${ratedImage.category}`, ratedImage.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
                return {
                    imageDate: imageData,
                    rating: ratedImage.rating
                };
            });
            return images;
        } catch (error) {
          throw new Error('Error fetching images');
        }
    }
}

module.exports = ImageRepository;