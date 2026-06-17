const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const listingRoutes = require('./routes/listing.routes');
const bookingRoutes = require('./routes/booking.routes');
const cleaningRoutes = require('./routes/cleaning.routes');
const constructionRoutes = require('./routes/construction.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'https://djerbahouch.fr', 'http://djerbahouch.fr'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running successfully' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cleaning-requests', cleaningRoutes);
app.use('/api/construction-requests', constructionRoutes);
app.use('/api/admin', adminRoutes);


module.exports = app;
