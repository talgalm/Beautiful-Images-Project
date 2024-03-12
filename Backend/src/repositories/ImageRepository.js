const { Image, FinalRating, TmpRating } = require("../Models");
const RatingRepository = require("./RatingRepository");

const fs = require('fs');
const path = require('path');


class ImageRepository {

    static async initializeImagesDB() {
      console.log("initializing images");
      const categories = fs.readdirSync(path.join(__dirname, '../../images'));
      for (const category of categories) {
        const images = fs.readdirSync(path.join(__dirname, `../../images/small/${category}`));

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

    static async fetchImages(email) {
        try {
            const userTmpRatings = await TmpRating.findAll({ where: { email: email } });
            if (userTmpRatings.length === 0) {
                const images = await ImageRepository.fetchNewImages(email);
                return images;

            }
            else {
                const images = await ImageRepository.fetchSessionImages(email);
                return images;
            }
        } catch (error) {
            throw new Error('Error fetching images');
        }
    }

    static async fetchNewImages(email) {
        try {
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
            RatingRepository.addInitialRatings(email, selectedImages);

            //using the image path, read the image and convert to base64
            selectedImages.forEach((image) => {
              const imagePath = path.join(__dirname, `../../images/small/${image.category}`, image.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
              image.imageData = imageData;
            });

            const result = [];
            selectedImages.forEach((image) => {
              result.push({imageId: image.id, imageData: image.imageData});
            });

            
            return result;
        } catch (error) {
            throw new Error('Error fetching images');
        }
    }

    static async fetchImage(imageId) {
        try {
          console.log("hello")
            const image = await Image.findOne({ where: { id: imageId } });
            const imagePath = path.join(__dirname, `../../images/original/${image.category}`, image.imageName);
            const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
            return {imageId: image.id, imageData: imageData};
        } catch (error) {
            throw new Error('Error fetching image');
        }
    }

    static async fetchSessionImages(email) {
        try {
            const userRatedImagesRatings = await TmpRating.findAll({ where: { email : email } });
            const userRatedImages = await Promise.all(userRatedImagesRatings.map(async (image) => {
              return await Image.findOne({ where: { id: image.imageId } });
            }));
            //return array of {image, rating}

            const result = [];
            for (const image of userRatedImages) {
              const imagePath = path.join(__dirname, `../../images/small/${image.category}`, image.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
              result.push({imageId: image.id, imageData: imageData});
            }
            //console.log(result.slice(0, 5));

            return result;
        } catch (error) {
          throw new Error('Error fetching images');
        }
    }
}

module.exports = ImageRepository;