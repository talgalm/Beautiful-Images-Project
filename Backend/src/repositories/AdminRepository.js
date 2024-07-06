const UserRepository = require("../repositories/UserRepository");
const RatingRepository = require("../repositories/RatingRepository");
const ImageRepository = require("../repositories/ImageRepository");
const { Rating, Image, User } = require("../Models");

const PDFDocument = require('pdfkit');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class AdminRepository {
  static async generatePdfReport(email) {
    const ratings = await RatingRepository.getAllRatings();
    const images = await ImageRepository.getAllImages();
    const users = await UserRepository.getAllUsers();

    
    let tableImages = [];
    for (let image of images) {
      const numOfRatings = await RatingRepository.getAmountOfRatings(image.id);
      const averageRating = await RatingRepository.getAverageImageRating(image.id) || 0;
      tableImages.push({
        id: image.id.substring(0, 8),
        name: image.imageName,
        category:  image.imageCategory,
        ratings: numOfRatings,
        averageRating: averageRating.toFixed(2)
      });
    }
    const table = {
      headers: ["Image ID", "Image Name", "Image Category", "Amount", "Average"],
      rows: tableImages.map(image => [
        image.id,
        image.name,
        image.category,
        image.ratings,
        image.averageRating
      ])
    };
    
    const doc = new PDFDocument();
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}--${date.getHours()}-${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}-${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;
    const filePath = `../pdf/report--${formattedDate}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(20).text('Image Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10);

    const startY = doc.y + 20;
    const rowHeight = 20;
    const colWidths = [0, 80, 80, 160, 80];
    const pageHeight = doc.page.height - doc.page.margins.bottom;
    
    const drawTableRow = (row, y) => {
      let colWidthSum = 0;
      row.forEach((cell, i) => {
          doc.text(cell, 50 + colWidthSum + colWidths[i], y);
          colWidthSum += colWidths[i];
      });
    };
    
    const drawTableHeaders = (y) => {
      let colWidthSum = 0;
      table.headers.forEach((header, i) => {
          doc.text(header, 50 + colWidthSum + colWidths[i], y);
          colWidthSum += colWidths[i];
      });
    };
    
    let y = startY;
    drawTableHeaders(y);
    y += rowHeight;
    
    table.rows.forEach((row, rowIndex) => {
        if (y + rowHeight > pageHeight) {
            doc.addPage();
            y = doc.page.margins.top;
            drawTableHeaders(y);
            y += rowHeight;
        }
        drawTableRow(row, y);
        y += rowHeight;
    });
    
    doc.end();

    console.log(`PDF file generated: ${filePath}`);

    return filePath;
  }

  static async generateCsvRatings() {
    const ratings = await Rating.findAll();
    return this.generateCsvFromTable("ratings", ratings);
  }

  static async generateCsvImages() {
    const images = await Image.findAll();
    return this.generateCsvFromTable("images", images);
  }

  static async generateCsvUsers() {
    const users = await User.findAll();
    return this.generateCsvFromTable("users", users);
  }

  static async generateCsvFromTable(name, data) {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}--${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;

    const records = data.map((record) => record.toJSON());

    const header = Object.keys(records[0]).map(key => ({id: key, title: key}));

    const filePath = `../csv/${name}--${formattedDate}.csv`;

    const csvWriter = createCsvWriter({
      path: filePath,
      header: header
    });

    await csvWriter.writeRecords(records);

    console.log(`CSV file generated: ${filePath}`);
    return filePath;
  }

  static async getParticipantsData() {
    // Fetch all participants who are not admins
    // Exclude 'email', 'nickname', 'password', and 'isAdmin' fields from the result
    const participants = await User.findAll({
      where: {
        isAdmin: false
      },
      attributes: { exclude: ['email','nickname','password', 'isAdmin', 'createdAt', 'updatedAt'] }
    });

     // Fetch all ratings where the type is 'final'
      // This will be used to determine which participants have finished at least one experiment
    const ratings = await Rating.findAll({
      where: {
        type: 'final'
      },
    });

    // Extract user IDs from the ratings
    // This gives us a list of user IDs who have at least one 'final' rating
    const completedExperimentUserIds = ratings.map(rating => rating.userId);
   
    // Filter participants to include only those who have completed at least one experiment
    // This is determined by checking if the participant's ID is in the list of user IDs with 'final' ratings
    const participantThatFinisedAtLeadtOneExperiment = participants.filter(participant =>completedExperimentUserIds.includes(participant.id))

    return participantThatFinisedAtLeadtOneExperiment;
  }

}

module.exports = AdminRepository;