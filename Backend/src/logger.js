const winston = require('winston');

// Configure the logger
const logger = winston.createLogger({
  level: 'info', // Log level (e.g., 'info', 'error', 'debug')
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    winston.format.simple()    
  ),
  transports: [
    
    new winston.transports.Console(),
    // File transport for logging to a file
    new winston.transports.File({ filename: 'beautiful-images-app.log' })
  ]
});

module.exports = logger;
