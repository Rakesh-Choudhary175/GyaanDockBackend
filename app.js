const express = require('express');
const morgan = require('morgan');

const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/question', questionRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/comment', commentRoutes);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});


module.exports = app;