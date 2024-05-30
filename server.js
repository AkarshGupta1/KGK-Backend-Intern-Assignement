const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Import path module for file paths
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rateLimiter = require('./middleware/rateLimiter');
// Apply rate limiter middleware to all requests
app.use(rateLimiter);

app.use(bodyParser.json());

// Import models
const User = require('./models/User');
const Item = require('./models/Item');
const Bid = require('./models/Bid');
const Notification = require('./models/Notification');

// Synchronize models with database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Unable to synchronize the database:', err);
});

// Define routes and middleware here...
const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const bidRouter = require('./routes/bid');
const notificationRouter = require('./routes/notification');

app.use('/users', userRouter);
app.use('/items', itemRouter);
app.use('/items', bidRouter); // Nested route for bids
app.use('/notifications', notificationRouter);

// Serve static files (uploaded images) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = { app, io };

