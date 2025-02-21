// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const rateLimit = require('express-rate-limit');
// // const morgan = require('morgan');
// // const compression = require('compression');
// // const winston = require('winston');
// // const { URL } = require('url');

// // // Configuration
// // const config = {
// //   app: {
// //     port: parseInt(process.env.PORT || '5000', 10),
// //     nodeEnv: process.env.NODE_ENV || 'development',
// //     buildVersion: process.env.BUILD_VERSION || 'development',
// //   },
// //   db: {
// //     url: process.env.MONGO_URL || 'mongodb+srv://JAYACHANDRAN:KQJrxDn44181NsqT@cluster0.w45he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
// //     options: {
// //       serverSelectionTimeoutMS: 10000,
// //       connectTimeoutMS: 10000,
// //       socketTimeoutMS: 45000,
// //       retryWrites: true,
// //       w: 'majority',
// //     },
// //   },
// //   security: {
// //     corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
// //     allowedImageDomains: [
// //       'imgur.com',
// //       'i.imgur.com',
// //       'upload.wikimedia.org',
// //       'images.unsplash.com',
// //       'cloudinary.com',
// //     ],
// //   },
// // };

// // // Logger Setup
// // const logger = winston.createLogger({
// //   level: 'info',
// //   format: winston.format.combine(
// //     winston.format.timestamp(),
// //     winston.format.json()
// //   ),
// //   transports: [
// //     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
// //     new winston.transports.File({ filename: 'logs/combined.log' }),
// //     new winston.transports.Console({
// //       format: winston.format.combine(
// //         winston.format.colorize(),
// //         winston.format.simple()
// //       ),
// //     }),
// //   ],
// // });

// // // Image URL Validator
// // const isValidImageUrl = (urlString) => {
// //   try {
// //     const url = new URL(urlString);
// //     const hostname = url.hostname;
// //     return config.security.allowedImageDomains.some(domain => 
// //       hostname === domain || hostname.endsWith(`.${domain}`)
// //     ) && url.protocol === 'https:' && /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname);
// //   } catch {
// //     return false;
// //   }
// // };

// // // Movie Schema
// // const movieSchema = new mongoose.Schema({
// //   title: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //   },
// //   releaseYear: {
// //     type: Number,
// //     required: true,
// //     min: 1888,
// //     max: new Date().getFullYear() + 5,
// //   },
// //   genre: [{
// //     type: String,
// //     required: true,
// //     enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'],
// //   }],
// //   director: {
// //     type: String,
// //     required: true,
// //   },
// //   poster: {
// //     type: String,
// //     validate: {
// //       validator: isValidImageUrl,
// //       message: 'Invalid image URL',
// //     },
// //   },
// //   rating: {
// //     type: Number,
// //     min: 0,
// //     max: 10,
// //     default: 0,
// //   },
// // }, {
// //   timestamps: true,
// // });

// // movieSchema.index({ title: 1, releaseYear: 1 }, { unique: true });
// // const Movie = mongoose.model('Movie', movieSchema);

// // // Express App Setup
// // const app = express();
// // let isShuttingDown = false;
// // let isDbConnected = false;

// // // Security Middleware
// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000,
// //   max: 100,
// //   message: { error: 'Too many requests, please try again later.' },
// //   standardHeaders: true,
// //   legacyHeaders: false,
// // });

// // app.use(helmet({
// //   contentSecurityPolicy: {
// //     directives: {
// //       defaultSrc: ["'self'"],
// //       connectSrc: ["'self'", ...config.security.corsOrigins],
// //       imgSrc: ["'self'", 'https:', 'data:', ...config.security.allowedImageDomains.map(domain => `https://*.${domain}`)],
// //     },
// //   },
// // }));

// // app.use(compression());
// // app.use(morgan('combined'));
// // app.use(limiter);
// // app.use(cors({
// //   origin: config.security.corsOrigins,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// //   credentials: true,
// //   maxAge: 86400,
// // }));

// // app.use(express.json({ limit: '10mb' }));
// // app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // // No-cache middleware
// // app.use((req, res, next) => {
// //   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
// //   res.setHeader('Pragma', 'no-cache');
// //   res.setHeader('Expires', '0');
// //   next();
// // });

// // // Request logging
// // app.use((req, res, next) => {
// //   if (!isShuttingDown) {
// //     logger.info(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
// //     next();
// //   } else {
// //     res.status(503).json({
// //       error: 'Service is shutting down',
// //       retryAfter: 30,
// //     });
// //   }
// // });

// // // Health Check Routes - Updated to match K8s probe paths
// // app.get('/api/health/live', (req, res) => {
// //   res.status(200).json({ 
// //     status: 'OK', 
// //     timestamp: new Date().toISOString() 
// //   });
// // });

// // app.get('/api/health/ready', (req, res) => {
// //   if (isDbConnected) {
// //     res.status(200).json({ 
// //       status: 'OK', 
// //       timestamp: new Date().toISOString() 
// //     });
// //   } else {
// //     res.status(503).json({ 
// //       status: 'Service Unavailable', 
// //       timestamp: new Date().toISOString() 
// //     });
// //   }
// // });

// // // Add legacy paths for backward compatibility
// // app.get('/health/live', (req, res) => {
// //   res.status(200).json({ 
// //     status: 'OK', 
// //     timestamp: new Date().toISOString() 
// //   });
// // });

// // app.get('/health/ready', (req, res) => {
// //   if (isDbConnected) {
// //     res.status(200).json({ 
// //       status: 'OK', 
// //       timestamp: new Date().toISOString() 
// //     });
// //   } else {
// //     res.status(503).json({ 
// //       status: 'Service Unavailable', 
// //       timestamp: new Date().toISOString() 
// //     });
// //   }
// // });

// // // Movie Routes
// // app.get('/api/movies', async (req, res, next) => {
// //   try {
// //     const { page = 1, limit = 10, genre, year, sort } = req.query;
    
// //     const query = {};
// //     if (genre) query.genre = genre;
// //     if (year) query.releaseYear = year;
    
// //     const sortOptions = {};
// //     if (sort) {
// //       const [field, order] = sort.split(':');
// //       sortOptions[field] = order === 'desc' ? -1 : 1;
// //     }

// //     const movies = await Movie.find(query)
// //       .sort(sortOptions)
// //       .limit(parseInt(limit))
// //       .skip((parseInt(page) - 1) * parseInt(limit));
      
// //     const total = await Movie.countDocuments(query);

// //     res.json({
// //       movies,
// //       totalPages: Math.ceil(total / limit),
// //       currentPage: parseInt(page),
// //       totalMovies: total,
// //     });
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // app.get('/api/movies/:id', async (req, res, next) => {
// //   try {
// //     const movie = await Movie.findById(req.params.id);
// //     if (!movie) {
// //       return res.status(404).json({ error: 'Movie not found' });
// //     }
// //     res.json(movie);
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // app.post('/api/movies', async (req, res, next) => {
// //   try {
// //     const movie = new Movie(req.body);
// //     await movie.save();
// //     logger.info(`New movie created: ${movie.title}`);
// //     res.status(201).json(movie);
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // app.put('/api/movies/:id', async (req, res, next) => {
// //   try {
// //     const movie = await Movie.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new: true, runValidators: true }
// //     );
// //     if (!movie) {
// //       return res.status(404).json({ error: 'Movie not found' });
// //     }
// //     logger.info(`Movie updated: ${movie.title}`);
// //     res.json(movie);
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // app.delete('/api/movies/:id', async (req, res, next) => {
// //   try {
// //     const movie = await Movie.findByIdAndDelete(req.params.id);
// //     if (!movie) {
// //       return res.status(404).json({ error: 'Movie not found' });
// //     }
// //     logger.info(`Movie deleted: ${movie.title}`);
// //     res.status(204).send();
// //   } catch (err) {
// //     next(err);
// //   }
// // });

// // // Error Handler
// // app.use((err, req, res, next) => {
// //   logger.error('Error:', {
// //     error: err,
// //     request: {
// //       method: req.method,
// //       path: req.path,
// //       headers: req.headers,
// //       body: req.body,
// //     },
// //   });

// //   const statusCode = err.status || 500;
// //   const errorResponse = {
// //     error: err.name || 'Internal Server Error',
// //     message: config.app.nodeEnv === 'development' ? err.message : 'An error occurred',
// //     status: statusCode,
// //     timestamp: new Date().toISOString(),
// //     path: req.path,
// //     version: config.app.buildVersion,
// //   };

// //   if (config.app.nodeEnv === 'development' && err.stack) {
// //     errorResponse.stack = err.stack;
// //   }

// //   res.status(statusCode).json(errorResponse);
// // });

// // // Database Connection
// // const connectDB = async (retries = 5, delay = 5000) => {
// //   while (retries > 0 && !isShuttingDown) {
// //     try {
// //       logger.info(`Connecting to MongoDB... (${retries} attempts remaining)`);
// //       await mongoose.connect(config.db.url, config.db.options);
// //       logger.info('✅ MongoDB connected successfully');
// //       isDbConnected = true;
// //       return true;
// //     } catch (err) {
// //       logger.error('❌ MongoDB connection error:', err);
// //       retries--;
// //       if (retries === 0) {
// //         logger.error('❌ Max retries reached');
// //         return false;
// //       }
// //       await new Promise(resolve => setTimeout(resolve, delay));
// //     }
// //   }
// //   return false;
// // };

// // // Server Startup
// // const startServer = async () => {
// //   try {
// //     const isConnected = await connectDB();

// //     if (!isConnected) {
// //       logger.error('Failed to connect to MongoDB. Exiting...');
// //       process.exit(1);
// //     }

// //     const server = app.listen(config.app.port, '0.0.0.0', () => {
// //       logger.info(`
// // 🚀 Server is running on port ${config.app.port}
// // 📦 Version: ${config.app.buildVersion}
// // 🔧 Environment: ${config.app.nodeEnv}
// // 🌐 CORS Origins: ${config.security.corsOrigins.join(', ')}
// // 🏥 Liveness: http://localhost:${config.app.port}/api/health/live
// // 🔍 Readiness: http://localhost:${config.app.port}/api/health/ready
// //       `);
// //     });

// //     // Graceful shutdown
// //     process.on('SIGINT', () => {
// //       isShuttingDown = true;
// //       logger.info('Shutting down server...');
// //       server.close(() => {
// //         mongoose.connection.close(false, () => {
// //           logger.info('MongoDB connection closed.');
// //           process.exit(0);
// //         });
// //       });
// //     });

// //     // Server error handler
// //     server.on('error', (err) => {
// //       logger.error('Server error:', err);
// //       process.exit(1);
// //     });

// //     // Periodic health checks
// //     setInterval(() => {
// //       if (!isShuttingDown && !isDbConnected) {
// //         logger.warn('Database connection check failed, attempting reconnect...');
// //         connectDB(3).catch(err => logger.error('Reconnection failed:', err));
// //       }
// //     }, 5000);
// //   } catch (err) {
// //     logger.error('Failed to start server:', err);
// //     process.exit(1);
// //   }
// // };

// // startServer();

// // module.exports = app;
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const morgan = require('morgan');
// const compression = require('compression');
// const winston = require('winston');
// const { URL } = require('url');

// // Configuration
// const config = {
//   app: {
//     port: parseInt(process.env.PORT || '5000', 10),
//     nodeEnv: process.env.NODE_ENV || 'development',
//     buildVersion: process.env.BUILD_VERSION || 'development',
//   },
//   db: {
//     url: process.env.MONGO_URL || 'mongodb+srv://JAYACHANDRAN:KQJrxDn44181NsqT@cluster0.w45he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//     options: {
//       serverSelectionTimeoutMS: 10000,
//       connectTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//       retryWrites: true,
//       w: 'majority',
//     },
//   },
//   security: {
//     corsOrigins: process.env.CORS_ORIGINS || '*',
//     allowedImageDomains: [
//       'imgur.com',
//       'i.imgur.com',
//       'upload.wikimedia.org',
//       'images.unsplash.com',
//       'cloudinary.com',
//     ],
//   },
// };

// // Logger Setup
// const logger = winston.createLogger({
//   level: process.env.LOG_LEVEL || 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'logs/combined.log' }),
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//       ),
//     }),
//   ],
// });

// // Image URL Validator
// const isValidImageUrl = (urlString) => {
//   try {
//     const url = new URL(urlString);
//     const hostname = url.hostname;
//     return config.security.allowedImageDomains.some(domain => 
//       hostname === domain || hostname.endsWith(`.${domain}`)
//     ) && url.protocol === 'https:' && /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname);
//   } catch {
//     return false;
//   }
// };

// // Movie Schema
// const movieSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   releaseYear: {
//     type: Number,
//     required: true,
//     min: 1888,
//     max: new Date().getFullYear() + 5,
//   },
//   genre: [{
//     type: String,
//     required: true,
//     enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'],
//   }],
//   director: {
//     type: String,
//     required: true,
//   },
//   poster: {
//     type: String,
//     validate: {
//       validator: isValidImageUrl,
//       message: 'Invalid image URL',
//     },
//   },
//   rating: {
//     type: Number,
//     min: 0,
//     max: 10,
//     default: 0,
//   },
// }, {
//   timestamps: true,
// });

// movieSchema.index({ title: 1, releaseYear: 1 }, { unique: true });
// const Movie = mongoose.model('Movie', movieSchema);

// // Express App Setup
// const app = express();
// let isShuttingDown = false;
// let isDbConnected = false;

// // Security Middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { error: 'Too many requests, please try again later.' },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Configure CORS
// const corsOptions = {
//   origin: config.security.corsOrigins === '*' 
//     ? '*' 
//     : config.security.corsOrigins.split(','),
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   maxAge: 86400,
// };

// app.use(cors(corsOptions));

// // Set up helmet with more permissive CSP
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: ["'self'", '*'],
//       imgSrc: ["'self'", 'https:', 'data:', '*'],
//     },
//   },
// }));

// app.use(compression());
// app.use(morgan('combined'));
// app.use(limiter);
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // No-cache middleware
// app.use((req, res, next) => {
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//   next();
// });

// // Request logging
// app.use((req, res, next) => {
//   if (!isShuttingDown) {
//     logger.info(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//     next();
//   } else {
//     res.status(503).json({
//       error: 'Service is shutting down',
//       retryAfter: 30,
//     });
//   }
// });

// // Health Check Routes - IMPORTANT! These must match Kubernetes probe paths
// // Primary health endpoints (matching Kubernetes probe paths)
// app.get('/health/live', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString() 
//   });
// });

// app.get('/health/ready', (req, res) => {
//   if (isDbConnected) {
//     res.status(200).json({ 
//       status: 'OK', 
//       timestamp: new Date().toISOString() 
//     });
//   } else {
//     res.status(503).json({ 
//       status: 'Service Unavailable', 
//       timestamp: new Date().toISOString() 
//     });
//   }
// });

// // Secondary API-prefixed endpoints for compatibility
// app.get('/api/health/live', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString() 
//   });
// });

// app.get('/api/health/ready', (req, res) => {
//   if (isDbConnected) {
//     res.status(200).json({ 
//       status: 'OK', 
//       timestamp: new Date().toISOString() 
//     });
//   } else {
//     res.status(503).json({ 
//       status: 'Service Unavailable', 
//       timestamp: new Date().toISOString() 
//     });
//   }
// });

// // Movie Routes
// app.get('/api/movies', async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10, genre, year, sort } = req.query;
    
//     const query = {};
//     if (genre) query.genre = genre;
//     if (year) query.releaseYear = year;
    
//     const sortOptions = {};
//     if (sort) {
//       const [field, order] = sort.split(':');
//       sortOptions[field] = order === 'desc' ? -1 : 1;
//     }

//     const movies = await Movie.find(query)
//       .sort(sortOptions)
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));
      
//     const total = await Movie.countDocuments(query);

//     res.json({
//       movies,
//       totalPages: Math.ceil(total / limit),
//       currentPage: parseInt(page),
//       totalMovies: total,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// app.get('/api/movies/:id', async (req, res, next) => {
//   try {
//     const movie = await Movie.findById(req.params.id);
//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }
//     res.json(movie);
//   } catch (err) {
//     next(err);
//   }
// });

// app.post('/api/movies', async (req, res, next) => {
//   try {
//     const movie = new Movie(req.body);
//     await movie.save();
//     logger.info(`New movie created: ${movie.title}`);
//     res.status(201).json(movie);
//   } catch (err) {
//     next(err);
//   }
// });

// app.put('/api/movies/:id', async (req, res, next) => {
//   try {
//     const movie = await Movie.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }
//     logger.info(`Movie updated: ${movie.title}`);
//     res.json(movie);
//   } catch (err) {
//     next(err);
//   }
// });

// app.delete('/api/movies/:id', async (req, res, next) => {
//   try {
//     const movie = await Movie.findByIdAndDelete(req.params.id);
//     if (!movie) {
//       return res.status(404).json({ error: 'Movie not found' });
//     }
//     logger.info(`Movie deleted: ${movie.title}`);
//     res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// });

// // Add a root path endpoint for API testing
// app.get('/', (req, res) => {
//   res.json({
//     message: "IMDB Clone API is running",
//     version: config.app.buildVersion,
//     environment: config.app.nodeEnv,
//     timestamp: new Date().toISOString()
//   });
// });

// // Error Handler
// app.use((err, req, res, next) => {
//   logger.error('Error:', {
//     error: err,
//     request: {
//       method: req.method,
//       path: req.path,
//       headers: req.headers,
//       body: req.body,
//     },
//   });

//   const statusCode = err.status || 500;
//   const errorResponse = {
//     error: err.name || 'Internal Server Error',
//     message: config.app.nodeEnv === 'development' ? err.message : 'An error occurred',
//     status: statusCode,
//     timestamp: new Date().toISOString(),
//     path: req.path,
//     version: config.app.buildVersion,
//   };

//   if (config.app.nodeEnv === 'development' && err.stack) {
//     errorResponse.stack = err.stack;
//   }

//   res.status(statusCode).json(errorResponse);
// });

// // Database Connection
// const connectDB = async (retries = 5, delay = 5000) => {
//   while (retries > 0 && !isShuttingDown) {
//     try {
//       logger.info(`Connecting to MongoDB... (${retries} attempts remaining)`);
//       await mongoose.connect(config.db.url, config.db.options);
//       logger.info('✅ MongoDB connected successfully');
//       isDbConnected = true;
//       return true;
//     } catch (err) {
//       logger.error('❌ MongoDB connection error:', err);
//       retries--;
//       if (retries === 0) {
//         logger.error('❌ Max retries reached');
//         return false;
//       }
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
//   return false;
// };

// // Server Startup
// const startServer = async () => {
//   try {
//     const isConnected = await connectDB();

//     if (!isConnected) {
//       logger.error('Failed to connect to MongoDB. Exiting...');
//       process.exit(1);
//     }

//     const server = app.listen(config.app.port, '0.0.0.0', () => {
//       logger.info(`
// 🚀 Server is running on port ${config.app.port}
// 📦 Version: ${config.app.buildVersion}
// 🔧 Environment: ${config.app.nodeEnv}
// 🌐 CORS Origins: ${config.security.corsOrigins}
// 🏥 Liveness: http://localhost:${config.app.port}/health/live
// 🔍 Readiness: http://localhost:${config.app.port}/health/ready
//       `);
//     });

//     // Graceful shutdown
//     process.on('SIGINT', () => {
//       isShuttingDown = true;
//       logger.info('Shutting down server...');
//       server.close(() => {
//         mongoose.connection.close(false, () => {
//           logger.info('MongoDB connection closed.');
//           process.exit(0);
//         });
//       });
//     });

//     // Server error handler
//     server.on('error', (err) => {
//       logger.error('Server error:', err);
//       process.exit(1);
//     });

//     // Periodic health checks
//     setInterval(() => {
//       if (!isShuttingDown && !isDbConnected) {
//         logger.warn('Database connection check failed, attempting reconnect...');
//         connectDB(3).catch(err => logger.error('Reconnection failed:', err));
//       }
//     }, 5000);
//   } catch (err) {
//     logger.error('Failed to start server:', err);
//     process.exit(1);
//   }
// };

// startServer();

// module.exports = app;
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const winston = require('winston');
const { URL } = require('url');

// Enhanced Configuration
const config = {
  app: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    buildVersion: process.env.BUILD_VERSION || 'development',
  },
  db: {
    url: process.env.MONGO_URL || 'mongodb+srv://JAYACHANDRAN:KQJrxDn44181NsqT@cluster0.w45he.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    options: {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    },
  },
  security: {
    corsOrigins: process.env.CORS_ORIGINS || '*',
    allowedImageDomains: [
      'imgur.com',
      'i.imgur.com',
      'upload.wikimedia.org',
      'images.unsplash.com',
      'cloudinary.com',
    ],
  },
};

// Enhanced Logger Setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Image URL Validator
const isValidImageUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname;
    return config.security.allowedImageDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    ) && url.protocol === 'https:' && /\.(jpg|jpeg|png|gif|webp)$/i.test(url.pathname);
  } catch {
    return false;
  }
};

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear() + 5,
  },
  genre: [{
    type: String,
    required: true,
    enum: ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance'],
  }],
  director: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    validate: {
      validator: isValidImageUrl,
      message: 'Invalid image URL',
    },
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
}, {
  timestamps: true,
});

// Add additional schemas
// Actor Schema
const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  bio: {
    type: String,
    maxlength: 1000,
  },
  photo: {
    type: String,
    validate: {
      validator: isValidImageUrl,
      message: 'Invalid image URL',
    },
  },
}, {
  timestamps: true,
});

// Producer Schema
const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 1000,
  },
  photo: {
    type: String,
    validate: {
      validator: isValidImageUrl,
      message: 'Invalid image URL',
    },
  },
}, {
  timestamps: true,
});

movieSchema.index({ title: 1, releaseYear: 1 }, { unique: true });
const Movie = mongoose.model('Movie', movieSchema);
const Actor = mongoose.model('Actor', actorSchema);
const Producer = mongoose.model('Producer', producerSchema);

// Express App Setup
const app = express();
let isShuttingDown = false;
let isDbConnected = false;

// Security Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure CORS for all environments
app.use(cors({
  origin: '*', // Allow all origins in development/testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

// Set up helmet with more permissive CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", '*'],
      imgSrc: ["'self'", 'https:', 'data:', '*'],
    },
  },
}));

app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// No-cache middleware
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Request logging
app.use((req, res, next) => {
  if (!isShuttingDown) {
    logger.info(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  } else {
    res.status(503).json({
      error: 'Service is shutting down',
      retryAfter: 30,
    });
  }
});

// Health Check Routes
app.get('/health/live', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/health/ready', (req, res) => {
  if (isDbConnected) {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } else {
    res.status(503).json({ 
      status: 'Service Unavailable', 
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Secondary API-prefixed endpoints
app.get('/api/health/live', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/health/ready', (req, res) => {
  if (isDbConnected) {
    res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected' 
    });
  } else {
    res.status(503).json({ 
      status: 'Service Unavailable', 
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Root path endpoint - important
app.get('/', (req, res) => {
  res.json({
    message: "IMDB Clone API is running",
    version: config.app.buildVersion,
    environment: config.app.nodeEnv,
    timestamp: new Date().toISOString(),
    endpoints: {
      movies: "/api/movies",
      actors: "/api/actors",
      producers: "/api/producers",
      health: "/health/live and /health/ready"
    }
  });
});

// Movie Routes
app.get('/api/movies', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, genre, year, sort } = req.query;
    
    const query = {};
    if (genre) query.genre = genre;
    if (year) query.releaseYear = year;
    
    const sortOptions = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'desc' ? -1 : 1;
    }

    const movies = await Movie.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      
    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalMovies: total,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

app.post('/api/movies', async (req, res, next) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    logger.info(`New movie created: ${movie.title}`);
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
});

app.put('/api/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    logger.info(`Movie updated: ${movie.title}`);
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/movies/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    logger.info(`Movie deleted: ${movie.title}`);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Actor Routes
app.get('/api/actors', async (req, res, next) => {
  try {
    const actors = await Actor.find();
    res.json(actors);
  } catch (err) {
    next(err);
  }
});

app.post('/api/actors', async (req, res, next) => {
  try {
    const actor = new Actor(req.body);
    await actor.save();
    logger.info(`New actor created: ${actor.name}`);
    res.status(201).json(actor);
  } catch (err) {
    next(err);
  }
});

// Producer Routes
app.get('/api/producers', async (req, res, next) => {
  try {
    const producers = await Producer.find();
    res.json(producers);
  } catch (err) {
    next(err);
  }
});

app.post('/api/producers', async (req, res, next) => {
  try {
    const producer = new Producer(req.body);
    await producer.save();
    logger.info(`New producer created: ${producer.name}`);
    res.status(201).json(producer);
  } catch (err) {
    next(err);
  }
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error('Error:', {
    error: err,
    request: {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body,
    },
  });

  const statusCode = err.status || 500;
  const errorResponse = {
    error: err.name || 'Internal Server Error',
    message: config.app.nodeEnv === 'development' ? err.message : 'An error occurred',
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
    version: config.app.buildVersion,
  };

  if (config.app.nodeEnv === 'development' && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// Database Connection with improved error handling
const connectDB = async (retries = 5, delay = 5000) => {
  while (retries > 0 && !isShuttingDown) {
    try {
      logger.info(`Connecting to MongoDB at ${config.db.url.split('@').pop()}... (${retries} attempts remaining)`);
      await mongoose.connect(config.db.url, config.db.options);
      logger.info('✅ MongoDB connected successfully');
      isDbConnected = true;
      return true;
    } catch (err) {
      logger.error('❌ MongoDB connection error:', err);
      retries--;
      if (retries === 0) {
        logger.error('❌ Max retries reached');
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

// Server Startup
const startServer = async () => {
  try {
    const isConnected = await connectDB();

    if (!isConnected) {
      logger.error('Failed to connect to MongoDB. Server will start but database features will be unavailable.');
      // Allow server to start even if DB connection fails
    }

    const server = app.listen(config.app.port, '0.0.0.0', () => {
      logger.info(`
🚀 Server is running on port ${config.app.port}
📦 Version: ${config.app.buildVersion}
🔧 Environment: ${config.app.nodeEnv}
🌐 CORS Origins: ${config.security.corsOrigins}
🏥 Liveness: http://localhost:${config.app.port}/health/live
🔍 Readiness: http://localhost:${config.app.port}/health/ready
      `);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      isShuttingDown = true;
      logger.info('Shutting down server...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed.');
          process.exit(0);
        });
      });
    });

    // Server error handler
    server.on('error', (err) => {
      logger.error('Server error:', err);
      process.exit(1);
    });

    // Periodic health checks
    setInterval(() => {
      if (!isShuttingDown && !isDbConnected) {
        logger.warn('Database connection check failed, attempting reconnect...');
        connectDB(3).catch(err => logger.error('Reconnection failed:', err));
      }
    }, 30000); // Reduced frequency to 30 seconds
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
