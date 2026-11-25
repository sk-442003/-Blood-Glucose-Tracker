const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const readingRoutes = require('./routes/readingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet());
const configuredClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === configuredClientUrl) return callback(null, true);
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { hostname, protocol } = new URL(origin);
        if (['localhost', '127.0.0.1', '[::1]'].includes(hostname) && protocol === 'http:') {
          return callback(null, true);
        }
      } catch {
        return callback(new Error('Invalid request origin'));
      }
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect(process.env.CLIENT_URL || 'http://localhost:5173');
});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/doctor', doctorRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
