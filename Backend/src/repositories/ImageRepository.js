const { Image, FinalRating, TmpRating } = require("../Models");
const RatingRepository = require("./RatingRepository");

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');


class ImageRepository {

    static async generateSmalllImages() {
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
      console.log("initializing images");
      const categories = fs.readdirSync(path.join(__dirname, '../../images/small'));
      for (const category of categories) {
        const images = fs.readdirSync(path.join(__dirname, `../../images/small/${category}`));

        for (const imageName of images) {
          
          //check if image already exists
          const image = await Image.findOne({ where: { imageName, category } });
          if (!image) {
            const imageId = generateImageId();
            const img = await Image.create({
              id: imageId,
              imageName: imageName,
              category: category
            });
          }
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
            const userTmpRatings = await TmpRating.findAll({ where: { email } });
            console.log(userTmpRatings);
            if (userTmpRatings.length === 0) {
              console.log("fetching new images");
              const images = await ImageRepository.fetchNewImages(email);
              return images;

            }
            else {
              console.log("fetching session images");
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
            //subtract rated images from all images
            const images = allImages.filter((image) => {
                return !userRatedImages.some((ratedImage) => {
                    return ratedImage.imageId === image.imageId;
                });
            });

            const totalNumOfImages = images.length;

            //select 70 images evenly from all categories
            let selectedImages = [];
            const categories = [...new Set(images.map((image) => image.category))];
            
            //create an array of arrays, each array will contain the images of a category
            let categoryImagesArray = categories.map((category) => images.filter((image) => image.category === category));
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
            RatingRepository.addInitialRatings(email, selectedImages);


            // Using the image path, read the image and convert to base64
            const imagePromises = selectedImages.map(async (image) => {
              const imagePath = path.join(__dirname, `../../images/small/${image.category}`, image.imageName);
              const imageData = await fs.promises.readFile(imagePath, { encoding: 'base64' });
              return {imageId: image.id, imageData: imageData};
            });

            const result = await Promise.all(imagePromises);

            return result;
        } catch (error) {
            throw new Error(`Error fetching images ${error}`);
        }
    }

    static async fetchImage(imageId) {
        try {
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
            const userRatedImages = await Promise.all(userRatedImagesRatings.map(async (rating) => {
              return await Image.findOne({ where: { id: rating.imageId } });
            }));
            //return array of {image, rating}

            const result = [];
            for (const image of userRatedImages) {
              //console.log(image);
              const imagePath = path.join(__dirname, `../../images/small/${image.category}`, image.imageName);
              const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
              const rating = userRatedImagesRatings.find((ratedImage) => ratedImage.imageId === image.id).rating;
              result.push({imageId: image.id, imageData: imageData, rating: rating});
            }
            //console.log(result.slice(0, 5));

            return result;
        } catch (error) {
          throw new Error('Error fetching images');
        }
    }
}

module.exports = ImageRepository;